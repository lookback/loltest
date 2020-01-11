import { Reporter, TestCase } from '.';
import { SerializedError } from '../lib/serialize-error';
interface LolTest2Reporter extends Reporter {
    fails: {
        testCase?: TestCase;
        error: Error | SerializedError;
        duration?: number;
    }[];
    failedFiles: Set<string>;
    passedFiles: Set<string>;
}
declare const LolTest2Reporter: LolTest2Reporter;
export default LolTest2Reporter;
