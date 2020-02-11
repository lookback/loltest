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
        return {
            name,
            ...obj[0],
        };
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
    const f = argv.indexOf('--test-filter'); // Optional
    return n >= 0
        ? {
            target: argv[n + 1],
            buildDir: argv[b + 1],
            testNameFilter: f !== -1 ? argv[f + 1] : undefined,
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
        'LOLTEST_MAX_CHILD_COUNT',
    ]);
    const testDir = path_1.default.relative(process.cwd(), path_1.default.join(process.cwd(), envConf.loltestTestDir || globalConf.testDir || DEFAULT_TEST_DIR));
    const buildDir = path_1.default.relative(process.cwd(), path_1.default.join(process.cwd(), testDir, envConf.loltestBuildDir || globalConf.buildDir || DEFAULT_BUILD_DIR));
    const maxChildCount = (envConf.loltestMaxChildCount &&
        parseInt(envConf.loltestMaxChildCount)) ||
        require('os').cpus().length;
    const reporter = envConf.loltestReporter || globalConf.reporter || 'loltest';
    const conf = {
        ...globalConf,
        reporter,
        testDir,
        buildDir,
        maxChildCount,
    };
    const pathToSelf = argv[1]; // 0 is nodejs itself
    const cliArgs = parseArgs(argv.slice(2));
    main_1.runMain(pathToSelf, {
        filter: cliArgs.fileFilter,
        testFilter: cliArgs.testFilter,
        ...conf,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQWlFO0FBQ2pFLGlDQUFtRDtBQUNuRCx5REFBbUQ7QUFDbkQsNkNBQXdDO0FBQ3hDLHVEQUFnRDtBQUNoRCxtREFBb0Q7QUFFcEQsdURBQXVEO0FBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLDBEQUEwRDtBQUMxRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztBQUVsQyxNQUFNLFNBQVMsR0FBRyw0QkFBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBZ0NoRSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQVksRUFBRSxHQUFRLEVBQVcsRUFBRTtJQUNuRCxJQUFJLGtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQU0sQ0FBQyw4QkFBOEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFL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