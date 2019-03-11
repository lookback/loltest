import { Reporter } from ".";
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
declare const LolTestReporter: Reporter;
export default LolTestReporter;
