"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_1 = require("./child");
const main_1 = require("./main");
const parse_cli_args_1 = require("./lib/parse-cli-args");
const parseArgs = parse_cli_args_1.mkParseArgs({
    '--reporter': String,
});
/** Declare a test impl. */
exports.test = (name, ...as) => {
    if (typeof as[0] == 'function') {
        if (as.length == 1) {
            child_1.foundTests.push({
                name,
                testfn: as[0],
            });
        }
        else {
            child_1.foundTests.push({
                name,
                before: as[0],
                testfn: as[1],
                after: as[2],
            });
        }
    }
    else {
        child_1.foundTests.push({
            name,
            ...as[0],
        });
    }
};
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
    child_1.runChild(runConf)
        .catch(e => {
        console.log("Tests failed", e);
        process.exit(1);
    });
}
else {
    const pathToSelf = argv[1]; // 0 is nodejs itself
    const testDir = path_1.default.join(process.cwd(), 'test');
    // `loltest some-file --tap` vs `loltest --tap some-file`
    const isPassingFilterFirst = !!argv[2]
        && !argv[2].startsWith('--');
    const filter = argv.slice(2).length > 1
        ? isPassingFilterFirst ? argv[2] : argv[argv.length - 1]
        : isPassingFilterFirst ? argv[2] : undefined;
    const cliArgs = parseArgs(isPassingFilterFirst
        ? argv.slice(3)
        : argv.slice(2, Math.max(argv.length - 1, 3)));
    main_1.runMain(pathToSelf, {
        testDir,
        filter,
        reporter: cliArgs['--reporter'],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXdEO0FBQ3hELGlDQUFpQztBQUNqQyx5REFBbUQ7QUFFbkQsTUFBTSxTQUFTLEdBQUcsNEJBQVcsQ0FBQztJQUMxQixZQUFZLEVBQUUsTUFBTTtDQUN2QixDQUFDLENBQUM7QUFvQkgsMkJBQTJCO0FBQ2QsUUFBQSxJQUFJLEdBQWlCLENBQUMsSUFBWSxFQUFFLEdBQUcsRUFBTyxFQUFFLEVBQUU7SUFDM0QsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUU7UUFDNUIsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNoQixrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1NBQ047S0FDSjtTQUFNO1FBQ0gsa0JBQVUsQ0FBQyxJQUFJLENBQUM7WUFDWixJQUFJO1lBQ0osR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ1gsQ0FBQyxDQUFDO0tBQ047QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBRTFCLHFDQUFxQztBQUNyQyxNQUFNLE9BQU8sR0FBbUIsQ0FBQyxHQUFHLEVBQUU7SUFDbEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2IsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMLGlFQUFpRTtBQUNqRSxJQUFJLE9BQU8sRUFBRTtJQUNULGVBQWU7SUFDZixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyw4QkFBOEI7SUFDN0QsZ0JBQVEsQ0FBQyxPQUFPLENBQUM7U0FDWixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0NBQ1Y7S0FBTTtJQUNILE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtJQUNqRCxNQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVqRCx5REFBeUQ7SUFDekQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztXQUMvQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUNuQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFFakQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLG9CQUFvQjtRQUMxQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDZixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNoRCxDQUFDO0lBRUYsY0FBTyxDQUFDLFVBQVUsRUFBRTtRQUNoQixPQUFPO1FBQ1AsTUFBTTtRQUNOLFFBQVEsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDO0tBQ2xDLENBQUMsQ0FBQztDQUNOIn0=