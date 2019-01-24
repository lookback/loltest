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