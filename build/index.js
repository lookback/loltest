"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_1 = require("./child");
const main_1 = require("./main");
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
    child_1.runChild(runConf);
}
else {
    const self = argv[1]; // 0 is nodejs itself
    const testDir = path_1.default.join(process.cwd(), 'test');
    const filter = argv[2];
    main_1.runMain(self, testDir, filter);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXdEO0FBQ3hELGlDQUFpQztBQW9CakMsMkJBQTJCO0FBQ2QsUUFBQSxJQUFJLEdBQWlCLENBQUMsSUFBWSxFQUFFLEdBQUcsRUFBTyxFQUFFLEVBQUU7SUFDM0QsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUU7UUFDNUIsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNoQixrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDWixJQUFJO2dCQUNKLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1NBQ047S0FDSjtTQUFNO1FBQ0gsa0JBQVUsQ0FBQyxJQUFJLGlCQUNYLElBQUksSUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ1YsQ0FBQztLQUNOO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUUxQixxQ0FBcUM7QUFDckMsTUFBTSxPQUFPLEdBQW1CLENBQUMsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNiLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxpRUFBaUU7QUFDakUsSUFBSSxPQUFPLEVBQUU7SUFDVCxlQUFlO0lBQ2YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsOEJBQThCO0lBQzdELGdCQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDckI7S0FBTTtJQUNILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtJQUMzQyxNQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsY0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDbEMifQ==