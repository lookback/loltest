import { Reporter } from '.';
interface TAPReporter extends Reporter {
    currentIndex: number;
    totalNumTests: number;
}
declare const TAPReporter: TAPReporter;
export default TAPReporter;
