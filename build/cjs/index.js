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
/** The directory in which to search for test files. */
const TEST_DIR_NAME = 'test';
const parseArgs = parse_cli_args_1.mkParseArgs({
    reporter: String,
}, ['fileFilter', 'testFilter']);
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
    require('ts-node').register(); // so we can require .ts-files
    child_1.runChild(runConf)
        .catch(e => {
        console.log("Tests failed", e);
        process.exit(1);
    });
}
else {
    const pathToSelf = argv[1]; // 0 is nodejs itself
    const testDir = path_1.default.join(process.cwd(), TEST_DIR_NAME);
    const cliArgs = parseArgs(argv.slice(2));
    main_1.runMain(pathToSelf, {
        testDir,
        reporter: cliArgs.reporter,
        filter: cliArgs.fileFilter,
        testFilter: cliArgs.testFilter,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQWlFO0FBQ2pFLGlDQUFpQztBQUNqQyx5REFBbUQ7QUFDbkQsNkNBQXdDO0FBRXhDLHVEQUF1RDtBQUN2RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFFN0IsTUFBTSxTQUFTLEdBQUcsNEJBQVcsQ0FBQztJQUMxQixRQUFRLEVBQUUsTUFBTTtDQUNuQixFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUF3QmpDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBWSxFQUFFLEdBQVEsRUFBVyxFQUFFO0lBQ25ELElBQUksa0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQU0sQ0FBQyw4QkFBOEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoQixDQUFDO1NBQ0w7S0FDSjtTQUFNO1FBQ0gsT0FBTztZQUNILElBQUk7WUFDSixHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDWixDQUFDO0tBQ0w7QUFDTCxDQUFDLENBQUM7QUFFVyxRQUFBLElBQUksR0FBUyxDQUFDLElBQVksRUFBRSxHQUFHLEVBQU8sRUFBRSxFQUFFO0lBQ25ELGtCQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBRTFCLHFDQUFxQztBQUNyQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQW1CLEVBQUU7SUFDbEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ2pELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNiLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxpRUFBaUU7QUFDakUsSUFBSSxPQUFPLEVBQUU7SUFDVCxlQUFlO0lBQ2YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsOEJBQThCO0lBQzdELGdCQUFRLENBQUMsT0FBTyxDQUFDO1NBQ1osS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztDQUNWO0tBQU07SUFDSCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFDakQsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFeEQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QyxjQUFPLENBQUMsVUFBVSxFQUFFO1FBQ2hCLE9BQU87UUFDUCxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7UUFDMUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1FBQzFCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtLQUNqQyxDQUFDLENBQUM7Q0FDTiJ9