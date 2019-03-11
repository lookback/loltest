"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorize_1 = require("../lib/colorize");
const formatError = (err) => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message;
        return [t, c[1]].join('\n');
    }
    else {
        return err.message;
    }
};
const logSuccess = (title, fileName) => `${colorize_1.green("✔︎")} ${fileName}: ${title}`;
const logFail = (title, fileName, error) => `${colorize_1.red("✗")} ${fileName}: ${title}\n${error && formatError(error)}\n`;
const pluralize = (noun, count) => count > 1 ? `${noun}s` : noun;
/**
 * A plain reporter.
 *
 * Sample output:
 *
 ```bash
Found 4 tests in 2 files...
✗ test-file.ts: This fails
2 == 4
    at __1.test (/Users/brookie/Projects/Code/lookback/loltest/test/test-file.ts:9:12)
✗ test-file.ts: Deep equal
{ foo: 'bar' } deepEqual { bar: 'foo' }
    at __1.test (/Users/brookie/Projects/Code/lookback/loltest/test/test-file.ts:13:12)
✔︎ another-test.ts: Another
✔︎ test-file.ts: It works

Ran 4 tests – 2 passed, 2 failed
```
 */
const LolTestReporter = {
    startRun: ({ total, numFiles }) => `Found ${total} ${pluralize('test', total)} in ${numFiles} ${pluralize('file', numFiles)}...`,
    test: ({ title, passed, fileName, error }) => {
        return '\n' + (passed
            ? logSuccess(title, fileName)
            : logFail(title, fileName, error));
    },
    // "Ran X tests. Y passed, Z failed"
    finishRun: ({ total, passed, failed, duration }) => {
        return [
            `\n\nRan ${total} ${pluralize('test', total)} in ${duration} ms`,
            `${passed ? colorize_1.green(passed + ' passed') : passed + ' passed'}, ${failed ? colorize_1.red(failed + ' failed') : failed + ' failed'}`,
        ].join('\n');
    },
    bail: (reason) => `${colorize_1.red('An error occurred!')}\n${reason}`,
};
exports.default = LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUE2QztBQUU3QyxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU07UUFDSCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FDbkQsR0FBRyxnQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUUsQ0FBQztBQUUzQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFBRSxFQUFFLENBQy9ELEdBQUcsY0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsS0FBSyxLQUFLLEtBQUssS0FBSyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBRTFFLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBWSxFQUFFLEtBQWEsRUFBRSxFQUFFLENBQzlDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSxlQUFlLEdBQWE7SUFDOUIsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUM5QixTQUFTLEtBQUssSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLFFBQVEsSUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSztJQUV4QyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7UUFDeEMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxNQUFNO1lBQ2pCLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztZQUM3QixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsb0NBQW9DO0lBQ3BDLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtRQUMvQyxPQUFPO1lBQ0gsV0FBVyxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxRQUFRLEtBQUs7WUFDaEUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxLQUN0RCxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUU7U0FDOUQsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ2IsR0FBRyxjQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxNQUFNLEVBQUU7Q0FDaEQsQ0FBQztBQUVGLGtCQUFlLGVBQWUsQ0FBQyJ9