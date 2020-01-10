"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_1 = require("./child");
const main_1 = require("./main");
const parse_cli_args_1 = require("./lib/parse-cli-args");
const colorize_1 = require("./lib/colorize");
const env_to_config_1 = require("./lib/env-to-config");
const global_conf_1 = require("./lib/global-conf");
/** The directory in which to search for test files. */
const DEFAULT_TEST_DIR = 'test';
/** Directory (under TEST_DIR) where we output files to */
const DEFAULT_BUILD_DIR = 'build';
const parseArgs = parse_cli_args_1.mkParseArgs({}, ['fileFilter', 'testFilter']);
const createTest = (name, obj) => {
    if (child_1.foundTests.find((t) => t.name === name)) {
        console.error(colorize_1.yellow(`Duplicate test case name: "${name}"`));
        process.exit(1);
    }
    if (typeof obj[0] === 'function') {
        if (obj.length === 1) {
            return {
                name,
                testfn: obj[0],
            };
        }
        else {
            return {
                name,
                before: obj[0],
                testfn: obj[1],
                after: obj[2],
            };
        }
    }
    else {
        return Object.assign({ name }, obj[0]);
    }
};
exports.test = (name, ...as) => {
    child_1.foundTests.push(createTest(name, as));
};
const argv = process.argv;
// fish out the childrunner start arg
const runConf = (() => {
    const n = argv.indexOf('--child-runner');
    const b = argv.indexOf('--build-dir');
    return n >= 0
        ? {
            target: argv[n + 1],
            buildDir: argv[b + 1],
        }
        : null;
})();
/** Switch depending on whether we're the forked child or not. */
if (runConf) {
    // run as child
    child_1.runChild(runConf).catch((e) => {
        console.log('Tests failed', e);
        process.exit(1);
    });
}
else {
    // Read conf from ~/.loltest
    const globalConf = global_conf_1.parseGlobalConf('.loltest');
    // Read local conf from env vars
    const envConf = env_to_config_1.envToConf(process.env, [
        'LOLTEST_REPORTER',
        'LOLTEST_TEST_DIR',
        'LOLTEST_BUILD_DIR',
    ]);
    const testDir = path_1.default.relative(process.cwd(), path_1.default.join(process.cwd(), envConf.loltestTestDir || globalConf.testDir || DEFAULT_TEST_DIR));
    const buildDir = path_1.default.relative(process.cwd(), path_1.default.join(process.cwd(), testDir, envConf.loltestBuildDir || globalConf.buildDir || DEFAULT_BUILD_DIR));
    const conf = {
        reporter: envConf.loltestReporter || globalConf.reporter,
        testDir,
        buildDir,
    };
    const pathToSelf = argv[1]; // 0 is nodejs itself
    const cliArgs = parseArgs(argv.slice(2));
    main_1.runMain(pathToSelf, Object.assign({ filter: cliArgs.fileFilter, testFilter: cliArgs.testFilter }, conf));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQWlFO0FBQ2pFLGlDQUFtRDtBQUNuRCx5REFBbUQ7QUFDbkQsNkNBQXdDO0FBQ3hDLHVEQUFnRDtBQUNoRCxtREFBb0Q7QUFFcEQsdURBQXVEO0FBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLDBEQUEwRDtBQUMxRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztBQUVsQyxNQUFNLFNBQVMsR0FBRyw0QkFBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBMkJoRSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQVksRUFBRSxHQUFRLEVBQVcsRUFBRTtJQUNuRCxJQUFJLGtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQU0sQ0FBQyw4QkFBOEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFL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