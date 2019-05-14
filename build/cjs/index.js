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
        child_1.foundTests.push(Object.assign({ name }, as[0]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXdEO0FBQ3hELGlDQUFpQztBQUNqQyx5REFBbUQ7QUFFbkQsTUFBTSxTQUFTLEdBQUcsNEJBQVcsQ0FBQztJQUMxQixZQUFZLEVBQUUsTUFBTTtDQUN2QixDQUFDLENBQUM7QUFvQkgsMkJBQTJCO0FBQ2QsUUFBQSxJQUFJLEdBQWlCLENBQUMsSUFBWSxFQUFFLEdBQUcsRUFBTyxFQUFFLEVBQUU7SUFDM0QsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUU7UUFDNUIsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNoQixrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1NBQ047S0FDSjtTQUFNO1FBQ0gsa0JBQVUsQ0FBQyxJQUFJLGlCQUNYLElBQUksSUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ1YsQ0FBQztLQUNOO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUUxQixxQ0FBcUM7QUFDckMsTUFBTSxPQUFPLEdBQW1CLENBQUMsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNiLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxpRUFBaUU7QUFDakUsSUFBSSxPQUFPLEVBQUU7SUFDVCxlQUFlO0lBQ2YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsOEJBQThCO0lBQzdELGdCQUFRLENBQUMsT0FBTyxDQUFDO1NBQ1osS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztDQUNWO0tBQU07SUFDSCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFDakQsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFakQseURBQXlEO0lBQ3pELE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7V0FDL0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDbkMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBRWpELE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxvQkFBb0I7UUFDMUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDaEQsQ0FBQztJQUVGLGNBQU8sQ0FBQyxVQUFVLEVBQUU7UUFDaEIsT0FBTztRQUNQLE1BQU07UUFDTixRQUFRLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQztLQUNsQyxDQUFDLENBQUM7Q0FDTiJ9