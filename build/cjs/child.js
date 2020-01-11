"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const assert_1 = require("assert");
const flatten_1 = require("./lib/flatten");
const serialize_error_1 = require("./lib/serialize-error");
const fs_1 = __importDefault(require("fs"));
// test() puts tests into here. This is *per file*.
exports.foundTests = [];
const sendMessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.send) {
        console.warn('Not in child process, cannot send message');
        return;
    }
    yield new Promise((rs) => process.send(msg, rs));
});
// Child process test runner
exports.runChild = (conf) => __awaiter(void 0, void 0, void 0, function* () {
    // tslint:disable-next-line:no-let
    let uncaughtException = false;
    // tslint:disable-next-line:no-let
    let unhandledRejection = false;
    process.on('uncaughtException', (e) => {
        console.log('Uncaught exception:', e);
        uncaughtException = true;
    });
    process.on('unhandledRejection', (e) => {
        console.log('Unhandled promise rejection:', e);
        unhandledRejection = true;
    });
    const testFilePaths = [conf.target];
    registerShadowedTs(conf);
    // tslint:disable-next-line: no-object-mutation
    process.env.NODE_ENV = process.env.NODE_ENV || 'test';
    const testFiles = testFilePaths.map((testPath) => {
        require(testPath);
        return {
            filePath: testPath,
            // "foundTests" is now filled with TestRuns. Remove them from the array
            // for next test file.
            tests: exports.foundTests.splice(0, exports.foundTests.length),
        };
    });
    const numFiles = testFiles.length;
    const totalNumTests = testFiles.reduce((acc, testFile) => acc + testFile.tests.length, 0);
    // deliberately don't await this.
    sendMessage({
        kind: 'run_start',
        payload: {
            numFiles,
            total: totalNumTests,
        },
    });
    const startTime = Date.now();
    const allTests = testFiles.map(doTest);
    const results = yield Promise.all(allTests);
    const flat = flatten_1.flatten(results);
    const testsAsBooleans = flat.map((t) => !t.fail);
    const allGood = testsAsBooleans.every((p) => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;
    const finishedMsg = {
        kind: 'run_complete',
        payload: {
            total: testsAsBooleans.length,
            passed: testsAsBooleans.filter((p) => p).length,
            failed: testsAsBooleans.filter((p) => !p).length,
            duration: Date.now() - startTime,
            numFiles,
        },
    };
    // do await this, since we want to know it's sent.
    yield sendMessage(finishedMsg);
    process.exit(clean ? 0 : 1);
});
/**
 * All ts files are prebuilt by the main process. This registers a handler where
 * require('test/foo.ts') will be dealt with as require('<buildDir/test/foo.js')
 */
const registerShadowedTs = (conf) => {
    // tslint:disable-next-line: no-object-mutation
    const jsHandler = require.extensions['.js'];
    require.extensions['.ts'] = (m, filename) => {
        const _compile = m._compile;
        // tslint:disable-next-line: no-object-mutation
        m._compile = function (code, fileName) {
            const jsName = fileName.replace(/\.ts$/, '.js');
            const rel = path_1.default.relative(process.cwd(), jsName);
            const prebuilt = path_1.default.join(process.cwd(), conf.buildDir, rel);
            const js = fs_1.default.readFileSync(prebuilt, 'utf-8');
            return _compile.call(this, js, filename);
        };
        return jsHandler(m, filename);
    };
};
/** foo/bar/baz.txt -> bar/baz.txt */
const fileNameWithParent = (filePath) => {
    const [file, parent] = filePath.split(path_1.default.sep).reverse();
    return path_1.default.join(parent, file);
};
const doTest = (testFile) => {
    const testFileName = fileNameWithParent(testFile.filePath);
    const tests = testFile.tests;
    if (!tests.length) {
        sendMessage({
            kind: 'test_error',
            reason: `${testFileName}: No tests found`,
        });
        return Promise.resolve([]);
    }
    const all = tests.map(({ name, before, testfn, after }, index) => __awaiter(void 0, void 0, void 0, function* () {
        const testCase = {
            title: name,
            fileName: testFileName,
            index,
        };
        // run before and save the args
        const args = yield tryRun(testFileName, name, before);
        if (isFail(args)) {
            console.error(`Error before ${name} in ${testFileName}: ${formatError(args.error)}`);
            return {
                name,
                filename: testFileName,
                fail: true,
                error: args.error,
                duration: 0,
            };
        }
        const testResult = yield tryRun(testFileName, name, () => __awaiter(void 0, void 0, void 0, function* () {
            sendMessage({
                kind: 'test_start',
                payload: testCase,
            });
            const startedAt = Date.now();
            yield testfn(args);
            const duration = Date.now() - startedAt;
            return {
                name,
                filename: testFileName,
                fail: false,
                duration,
            };
        }));
        sendMessage({
            kind: 'test_result',
            payload: {
                testCase,
                passed: !testResult.fail,
                error: testResult.error
                    ? serialize_error_1.serializeError(testResult.error)
                    : undefined,
                duration: testResult.duration,
            },
        });
        // always run AFTER, regardless of testResult.
        yield tryRun(testFileName, name, () => after
            ? after(args).catch((err) => {
                console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
            })
            : undefined);
        return testResult;
    }));
    return Promise.all(all);
};
const isFail = (t) => !!t && !!t.fail;
const tryRun = (testFile, name, fn) => Promise.resolve()
    .then(fn)
    .catch((err) => ({
    name,
    fail: true,
    filename: testFile,
    error: err,
    duration: 0,
}));
const formatError = (e) => {
    if (e instanceof Error) {
        if (e.stack) {
            const c = e.stack.split('\n');
            const t = e instanceof assert_1.AssertionError ? e.message : c[0];
            return [t, c[1]].join('\n');
        }
        else {
            return e.message;
        }
    }
    return e;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXdDO0FBT3hDLDJDQUF3QztBQUN4QywyREFBdUQ7QUFDdkQsNENBQW9CO0FBMEVwQixtREFBbUQ7QUFDdEMsUUFBQSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBRXhDLE1BQU0sV0FBVyxHQUFHLENBQU8sR0FBWSxFQUFpQixFQUFFO0lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzFELE9BQU87S0FDVjtJQUNELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFBLENBQUM7QUFFRiw0QkFBNEI7QUFDZixRQUFBLFFBQVEsR0FBRyxDQUFPLElBQWEsRUFBaUIsRUFBRTtJQUMzRCxrQ0FBa0M7SUFDbEMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFDOUIsa0NBQWtDO0lBQ2xDLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBRS9CLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxDQUFDO1FB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