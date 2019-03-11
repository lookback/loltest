"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorize_1 = require("../lib/colorize");
const DotReporter = {
    startRun: ({ numFiles, total }) => '',
    test: ({ title, passed, index, error, duration }) => passed ? '.' : colorize_1.red('.'),
    // "Ran X tests. Y passed, Z failed"
    finishRun: ({ total, passed, failed, duration }) => `\n\n${passed}/${total} in ${duration} ms`,
    bail: reason => '',
};
exports.default = DotReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG90LXJlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9ydGVycy9kb3QtcmVwb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4Q0FBc0M7QUFFdEMsTUFBTSxXQUFXLEdBQWE7SUFDMUIsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7SUFFckMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUNoRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsY0FBRyxDQUFDLEdBQUcsQ0FBQztJQUUzQixvQ0FBb0M7SUFDcEMsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQy9DLE9BQU8sTUFBTSxJQUFJLEtBQUssT0FBTyxRQUFRLEtBQUs7SUFFOUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtDQUNyQixDQUFDO0FBRUYsa0JBQWUsV0FBVyxDQUFDIn0=