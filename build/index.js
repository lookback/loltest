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
exports.test = (name, ...as) => {
    if (typeof as[0] == 'function') {
        if (as.length == 1) {
            foundTests.push({
                name,
                testfn: as[0],
            });
        }
        else {
            foundTests.push({
                name,
                before: as[0],
                testfn: as[1],
                after: as[2],
            });
        }
    }
    else {
        foundTests.push(Object.assign({ name }, as[0]));
    }
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
        const all = tests.map(({ name, before, testfn, after }) => __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:no-let
            let phase = 'BEFORE';
            try {
                const args = yield Promise.resolve().then(before);
                phase = '';
                yield Promise.resolve().then(() => testfn(args));
                phase = 'AFTER';
                yield Promise.resolve().then(() => after && after(args));
                console.log('✔︎', testFile, name);
                return true;
            }
            catch (e) {
                const pfxname = phase ? `${phase} ${name}` : name;
                const msg = errorMessage(testFile, pfxname, e);
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
function errorMessage(testFile, name, e) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3QztBQUN4QyxrRUFBMEM7QUFDMUMsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQW9CeEIsK0JBQStCO0FBQ2xCLFFBQUEsSUFBSSxHQUFpQixDQUFDLElBQVksRUFBRSxHQUFHLEVBQU8sRUFBRSxFQUFFO0lBQzNELElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxFQUFFO1FBQzVCLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDaEIsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUNaLElBQUk7Z0JBQ0osTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDZixDQUFDLENBQUM7U0FDTjtLQUNKO1NBQU07UUFDSCxVQUFVLENBQUMsSUFBSSxpQkFDWCxJQUFJLElBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNWLENBQUM7S0FDTjtBQUNMLENBQUMsQ0FBQztBQVNGLCtCQUErQjtBQUMvQixNQUFNLFVBQVUsR0FBYyxFQUFFLENBQUM7QUFFakMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQU0xQixxQ0FBcUM7QUFDckMsTUFBTSxPQUFPLEdBQW1CLENBQUMsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QyxPQUFPLENBQUMsSUFBSSxD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