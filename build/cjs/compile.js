"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const colorize_1 = require("./lib/colorize");
const fs_1 = __importDefault(require("fs"));
exports.compileTs = (testFiles, config, reporter, out) => {
    const tsconfigPath = typescript_1.default.findConfigFile(
    /*searchPath*/ './', typescript_1.default.sys.fileExists, 'tsconfig.json');
    if (!tsconfigPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    const tsconfigOrig = JSON.parse(fs_1.default.readFileSync(tsconfigPath, 'utf-8'));
    const parseConfigHost = {
        ...typescript_1.default.sys,
        onUnRecoverableConfigFileDiagnostic: () => { },
    };
    const parsedTsConf = typescript_1.default.parseJsonConfigFileContent(tsconfigOrig, parseConfigHost, './');
    const compOpts = {
        ...parsedTsConf.options,
        // test/build
        outDir: config.buildDir,
        // this is just annoying when running tests
        noImplicitAny: false,
        noImplicitReturns: false,
        noImplicitThis: false,
        noUnusedLocals: false,
        strictNullChecks: false,
        noStrictGenericChecks: false,
    };
    const host = typescript_1.default.createCompilerHost(compOpts);
    const fileNames = [...parsedTsConf.fileNames, ...testFiles];
    let numFiles = 0; // tslint:disable-line
    // tslint:disable-next-line: no-object-mutation
    host.writeFile = (fileName, content) => {
        numFiles++;
        return typescript_1.default.sys.writeFile(fileName, content);
    };
    const program = typescript_1.default.createProgram(fileNames, compOpts, host);
    reporter.onCompileStart(out);
    const startTime = Date.now();
    const emitResult = program.emit();
    emitResult.diagnostics.forEach((diagnostic) => {
        if (diagnostic.category !== typescript_1.default.DiagnosticCategory.Error) {
            return;
        }
        if (diagnostic.file) {
            const { line, character, } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character +
                1}): ${message}`);
        }
        else {
            console.error(colorize_1.red(typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
        }
    });
    if (emitResult.emitSkipped) {
        process.exit(1);
    }
    reporter.onCompileEnd({
        numFiles,
        duration: Date.now() - startTime,
    }, out);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQTRCO0FBRTVCLDZDQUFxQztBQUNyQyw0Q0FBb0I7QUFHUCxRQUFBLFNBQVMsR0FBRyxDQUNyQixTQUFtQixFQUNuQixNQUF3QixFQUN4QixRQUFrQixFQUNsQixHQUFXLEVBQ2IsRUFBRTtJQUNBLE1BQU0sWUFBWSxHQUFHLG9CQUFFLENBQUMsY0FBYztJQUNsQyxjQUFjLENBQUMsSUFBSSxFQUNuQixvQkFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQ2pCLGVBQWUsQ0FDbEIsQ0FBQztJQUNGLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7S0FDOUQ7SUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFeEUsTUFBTSxlQUFlLEdBQTJCO1FBQzVDLEdBQUcsb0JBQUUsQ0FBQyxHQUFHO1FBQ1QsbUNBQW1DLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztLQUNoRCxDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsb0JBQUUsQ0FBQywwQkFBMEIsQ0FDOUMsWUFBWSxFQUNaLGVBQWUsRUFDZixJQUFJLENBQ1AsQ0FBQztJQUVGLE1BQU0sUUFBUSxHQUF1QjtRQUNqQyxHQUFHLFlBQVksQ0FBQyxPQUFPO1FBQ3ZCLGFBQWE7UUFDYixNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVE7UUFDdkIsMkNBQTJDO1FBQzNDLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsY0FBYyxFQUFFLEtBQUs7UUFDckIsY0FBYyxFQUFFLEtBQUs7UUFDckIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixxQkFBcUIsRUFBRSxLQUFLO0tBQy9CLENBQUM7SUFFRixNQUFNLElBQUksR0FBRyxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsU0FBUyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFFNUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO0lBRXhDLCtDQUErQztJQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ25DLFFBQVEsRUFBRSxDQUFDO1FBQ1gsT0FBTyxvQkFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHLG9CQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFNUQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDN0IsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRWxDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7UUFDMUMsSUFBSSxVQUFVLENBQUMsUUFBUSxLQUFLLG9CQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1lBQ3JELE9BQU87U0FDVjtRQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNqQixNQUFNLEVBQ0YsSUFBSSxFQUNKLFNBQVMsR0FDWixHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQzdDLFVBQVUsQ0FBQyxLQUFNLENBQ3BCLENBQUM7WUFDRixNQUFNLE9BQU8sR0FBRyxvQkFBRSxDQUFDLDRCQUE0QixDQUMzQyxVQUFVLENBQUMsV0FBVyxFQUN0QixJQUFJLENBQ1AsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQ1AsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLFNBQVM7Z0JBQ2pELENBQUMsTUFBTSxPQUFPLEVBQUUsQ0FDdkIsQ0FBQztTQUNMO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUNULGNBQUcsQ0FDQyxvQkFBRSxDQUFDLDRCQUE0QixDQUMzQixVQUFVLENBQUMsV0FBVyxFQUN0QixJQUFJLENBQ1AsQ0FDSixDQUNKLENBQUM7U0FDTDtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxRQUFRLENBQUMsWUFBWSxDQUNqQjtRQUNJLFFBQVE7UUFDUixRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVM7S0FDbkMsRUFDRCxHQUFHLENBQ04sQ0FBQztBQUNOLENBQUMsQ0FBQyJ9