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
const assert_1 = require("assert");
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** Declare a test function. */
exports.test = (name, fn) => {
    foundTests.push({ name, fn });
};
// test() puts tests into here.
const foundTests = [];
const argv = process.argv;
// fish out the childrunner start arg
const runConf = (() => {
    const n = argv.indexOf('--child-runner');
    return n >= 0 ? {
        target: argv[n + 1],
    } : null;
})();
/** Switch depending on whether we're the forked child or not. */
if (runConf) {
    // run as child
    require('ts-node').register(); // so we can require .ts-files
    run(runConf);
}
else {
    // we need to start a child process.
    const self = argv[1]; // 0 is nodejs itself
    const testDir = path_1.default.join(process.cwd(), 'test');
    const filter = argv[2];
    const target = findTarget(testDir, filter);
    const child = child_process_1.default.fork(self, ['--child-runner', target]);
    child.addListener('exit', childExit => {
        // die when child dies.
        const code = childExit ? childExit : 0;
        process.exit(code);
    });
}
/** Find a target to start child process from. */
function findTarget(testDir, filter) {
    if (filter) {
        const jsFiles = scan(testDir);
        const file = jsFiles.find(f => f.startsWith(filter));
        if (file) {
            return path_1.default.join(testDir, file);
        }
        else {
            console.error("No test file found for:", filter);
            process.exit(1);
        }
    }
    return testDir;
}
// TODO: recursive dir scanning
function scan(dir) {
    const allFiles = fs_1.default.readdirSync(dir);
    return allFiles.filter(n => !n.startsWith('_') && (n.endsWith('ts') || n.endsWith('js')));
}
// Child process test runner
function run(conf) {
    return __awaiter(this, void 0, void 0, function* () {
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
}
function getTestPaths(target) {
    const stat = fs_1.default.statSync(target);
    if (stat.isFile()) {
        return [target];
    }
    else if (stat.isDirectory()) {
        return scan(target).map(n => path_1.default.join(target, n));
    }
    console.error("Neither file nor directory", target);
    return process.exit(1);
}
function doTest(testPath) {
    const testFile = path_1.default.basename(testPath);
    require(testPath);
    const tests = foundTests.splice(0, foundTests.length);
    if (tests.length) {
        const all = tests.map(({ name, fn }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.resolve().then(fn);
                console.log('✔︎', testFile, name);
                return true;
            }
            catch (e) {
                const msg = errorMessage(e, testFile, name);
                console.log(...msg);
                return false;
            }
        }));
        return Promise.all(all);
    }
    else {
        console.log(' ', testFile, 'No tests found');
    }
    return Promise.resolve([]);
}
const ERR_PRELUDE = '\x1b[31m✗\x1b[0m';
function errorMessage(e, testFile, name) {
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3QztBQUN4QyxrRUFBMEM7QUFDMUMsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUV4QiwrQkFBK0I7QUFDbEIsUUFBQSxJQUFJLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBNEIsRUFBRSxFQUFFO0lBQy9ELFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFRiwrQkFBK0I7QUFDL0IsTUFBTSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBRWpDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFNMUIscUNBQXFDO0FBQ3JDLE1BQU0sT0FBTyxHQUFtQixDQUFDLEdBQUcsRUFBRTtJQUNsQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDYixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUwsaUVBQWlFO0FBQ2pFLElBQUksT0FBTyxFQUFFO0lBQ1QsZUFBZTtJQUNmLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLDhCQUE4QjtJQUM3RCxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDaEI7S0FBTTtJQUNILG9DQUFvQztJQUNwQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFDM0MsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENB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