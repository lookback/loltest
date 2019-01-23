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
    return allFiles.filter(n => n.endsWith('ts') || n.endsWith('js'));
}
// Child process test runner
function run(conf) {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-let
        let uncaughtException = false, unhandledRejection = false;
        process.on('uncaughtException', (e) => {
            console.log('Uncaught exception', e);
            uncaughtException = true;
        });
        process.on('unhandledRejection', (e) => {
            console.log('Unhandled promise rejection', e);
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