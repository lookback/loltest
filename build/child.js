"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const assert_1 = require("assert");
const main_1 = require("./main");
// test() puts tests into here.
exports.foundTests = [];
// Child process test runner
exports.runChild = (conf) => __awaiter(this, void 0, void 0, function* () {
    // tslint:disable-next-line:no-let
    let uncaughtException = false, unhandledRejection = false;
    process.on('uncaughtException', (e) => {
        console.log('Uncaught exception:', e);
        uncaughtException = true;
    });
    process.on('unhandledRejection', (e) => {
        console.log('Unhandled promise rejection:', e);
        unhandledRejection = true;
    });
    const testPaths = getTestPaths(conf.target);
    const allTests = testPaths.map(doTest);
    Promise.all(allTests)
        .then((results) => {
        const flat = Array.prototype.concat.apply([], results);
        const allGood = flat.reduce((p, c) => p && c);
        const clean = allGood && !uncaughtException && !unhandledRejection;
        console.log(allGood, uncaughtException, unhandledRejection);
        process.exit(clean ? 0 : 1);
    });
});
const getTestPaths = (target) => {
    const stat = fs_1.default.statSync(target);
    if (stat.isFile()) {
        return [target];
    }
    else if (stat.isDirectory()) {
        return main_1.scan(target).map(n => path_1.default.join(target, n));
    }
    console.error("Neither file nor directory", target);
    return process.exit(1);
};
const doTest = (testPath) => {
    const testFile = path_1.default.basename(testPath);
    require(testPath);
    const tests = exports.foundTests.splice(0, exports.foundTests.length);
    if (tests.length) {
        const all = tests.map(({ name, before, testfn, after }) => __awaiter(this, void 0, void 0, function* () {
            // run before and save the args
            const args = yield tryRun(testFile, name, 'BEFORE', before);
            if (isFail(args)) {
                // abort if BEFORE failed.
                return false;
            }
            const testResult = yield tryRun(testFile, name, '', () => testfn(args));
            // always run AFTER, regardless of testResult.
            yield tryRun(testFile, name, 'AFTER', () => after && after(args));
            if (!isFail(testResult)) {
                console.log('✔︎', testFile, name);
                return true;
            }
            return false;
        }));
        return Promise.all(all);
    }
    else {
        console.log(' ', testFile, 'No tests found');
    }
    return Promise.resolve([]);
};
const Fail = {
    fail: true,
};
const isFail = (t) => t === Fail;
const tryRun = (testFile, name, phase, fn) => Promise.resolve().then(fn)
    .catch(e => {
    const pfxname = phase ? `${phase} ${name}` : name;
    const msg = errorMessage(testFile, pfxname, e);
    console.log(...msg);
    return Fail;
});
const ERR_PRELUDE = '\x1b[31m✗\x1b[0m';
const errorMessage = (testFile, name, e) => {
    const msg = (() => {
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
        else {
            return e;
        }
    })();
    return [ERR_PRELUDE, testFile, `${name}:`, msg];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsbUNBQXdDO0FBQ3hDLGlDQUE4QjtBQWE5QiwrQkFBK0I7QUFDbEIsUUFBQSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBRXhDLDRCQUE0QjtBQUNmLFFBQUEsUUFBUSxHQUFHLENBQU8sSUFBYSxFQUFpQixFQUFFO0lBQzNELGtDQUFrQztJQUNsQyxJQUFJLGlCQUFpQixHQUFHLEtBQUssRUFBRSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDMUQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0Msa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0lBQzlCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1NBQ2hCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ2QsTUFBTSxJQUFJLEdBQWMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFB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