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
const parseArgs = parse_cli_args_1.mkParseArgs({}, ['fileFilter', 'testFilter']);
const createTest = (name, obj) => {
    if (child_1.foundTests.find(t => t.name === name)) {
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
    const t = argv.indexOf('--test-filter');
    return n >= 0 ? {
        target: argv[n + 1],
        testFilter: t !== -1 ? argv[t + 1] : undefined,
    } : null;
})();
/** Switch depending on whether we're the forked child or not. */
if (runConf) {
    // run as child
    child_1.runChild(runConf)
        .catch(e => {
        console.log("Tests failed", e);
        process.exit(1);
    });
}
else {
    // Read conf from ~/.loltest
    const globalConf = global_conf_1.parseGlobalConf('.loltest');
    // Read local conf from env vars
    const envConf = env_to_config_1.envToConf(process.env, ['LOLTEST_REPORTER', 'LOLTEST_TEST_DIR']);
    const testDir = path_1.default.join(process.cwd(), envConf.loltestTestDir ||
        globalConf.testDir ||
        DEFAULT_TEST_DIR);
    const conf = {
        reporter: envConf.loltestReporter || globalConf.reporter,
        testDir,
    };
    const pathToSelf = argv[1]; // 0 is nodejs itself
    const cliArgs = parseArgs(argv.slice(2));
    main_1.runMain(pathToSelf, {
        filter: cliArgs.fileFilter,
        testFilter: cliArgs.testFilter,
        ...conf,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQWlFO0FBQ2pFLGlDQUFtRDtBQUNuRCx5REFBbUQ7QUFDbkQsNkNBQXdDO0FBQ3hDLHVEQUFnRDtBQUNoRCxtREFBb0Q7QUFFcEQsdURBQXVEO0FBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBRWhDLE1BQU0sU0FBUyxHQUFHLDRCQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUF3QmhFLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBWSxFQUFFLEdBQVEsRUFBVyxFQUFFO0lBQ25ELElBQUksa0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQU0sQ0FBQyw4QkFBOEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoQixDQUFDO1NBQ0w7S0FDSjtTQUFNO1FBQ0gsT0FBTztZQUNILElBQUk7WUFDSixHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDWixDQUFDO0tBQ0w7QUFDTCxDQUFDLENBQUM7QUFFVyxRQUFBLElBQUksR0FBUyxDQUFDLElBQVksRUFBRSxHQUFHLEVBQU8sRUFBRSxFQUFFO0lBQ25ELGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBRTFCLHFDQUFxQztBQUNyQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQW1CLEVBQUU7SUFDbEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ2pELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNiLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxpRUFBaUU7QUFDakUsSUFBSSxPQUFPLEVBQUU7SUFDVCxlQUFlO0lBQ2YsZ0JBQVEsQ0FBQyxPQUFPLENBQUM7U0FDWixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0NBQ1Y7S0FBTTtJQUNILDRCQUE0QjtJQUM1QixNQUFNLFVBQVUsR0FBRyw2QkFBZSxDQUFtQixVQUFVLENBQUMsQ0FBQztJQUNqRSxnQ0FBZ0M7SUFDaEMsTUFBTSxPQUFPLEdBQUcseUJBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBRWpGLE1BQU0sT0FBTyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxjQUFjO1FBQzNELFVBQVUsQ0FBQyxPQUFPO1FBQ2xCLGdCQUFnQixDQUFDLENBQUM7SUFFdEIsTUFBTSxJQUFJLEdBQW1EO1FBQ3pELFFBQVEsRUFBRSxPQUFPLENBQUMsZUFBZSxJQUFJLFVBQVUsQ0FBQyxRQUFRO1FBQ3hELE9BQU87S0FDVixDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO0lBRWpELE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekMsY0FBTyxDQUFDLFVBQVUsRUFBRTtRQUNoQixNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVU7UUFDMUIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1FBQzlCLEdBQUcsSUFBSTtLQUNWLENBQUMsQ0FBQztDQUNOIn0=