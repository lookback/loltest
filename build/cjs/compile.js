"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const colorize_1 = require("./lib/colorize");
const fs_1 = __importDefault(require("fs"));
exports.compileTs = (testFiles, config) => {
    const tsconfigPath = typescript_1.default.findConfigFile(
    /*searchPath*/ './', typescript_1.default.sys.fileExists, 'tsconfig.json');
    if (!tsconfigPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    const tsconfigOrig = JSON.parse(fs_1.default.readFileSync(tsconfigPath, 'utf-8'));
    const parseConfigHost = Object.assign(Object.assign({}, typescript_1.default.sys), { onUnRecoverableConfigFileDiagnostic: () => { } });
    const parsedTsConf = typescript_1.default.parseJsonConfigFileContent(tsconfigOrig, parseConfigHost, './');
    const compOpts = Object.assign(Object.assign({}, parsedTsConf.options), { 
        // test/build
        outDir: config.buildDir, 
        // this is just annoying when running tests
        noImplicitAny: false, noImplicitReturns: false, noImplicitThis: false, noUnusedLocals: false, strictNullChecks: false, noStrictGenericChecks: false });
    const host = typescript_1.default.createCompilerHost(compOpts);
    const fileNames = [...parsedTsConf.fileNames, ...testFiles];
    // tslint:disable-next-line: no-object-mutation
    host.writeFile = (fileName, content) => typescript_1.default.sys.writeFile(fileName, content);
    const program = typescript_1.default.createProgram(fileNames, compOpts, host);
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQTRCO0FBRTVCLDZDQUFxQztBQUNyQyw0Q0FBb0I7QUFFUCxRQUFBLFNBQVMsR0FBRyxDQUFDLFNBQW1CLEVBQUUsTUFBd0IsRUFBRSxFQUFFO0lBQ3ZFLE1BQU0sWUFBWSxHQUFHLG9CQUFFLENBQUMsY0FBYztJQUNsQyxjQUFjLENBQUMsSUFBSSxFQUNuQixvQkFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQ2pCLGVBQWUsQ0FDbEIsQ0FBQztJQUNGLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7S0FDOUQ7SUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFeEUsTUFBTSxlQUFlLG1DQUNkLG9CQUFFLENBQUMsR0FBRyxLQUNULG1DQUFtQyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUMsR0FDaEQsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLG9CQUFFLENBQUMsMEJBQTBCLENBQzlDLFlBQVksRUFDWixlQUFlLEVBQ2YsSUFBSSxDQUNQLENBQUM7SUFFRixNQUFNLFFBQVEsbUNBQ1AsWUFBWSxDQUFDLE9BQU87UUFDdkIsYUFBYTtRQUNiLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUTtRQUN2QiwyQ0FBMkM7UUFDM0MsYUFBYSxFQUFFLEtBQUssRUFDcEIsaUJBQWlCLEVBQUUsS0FBSyxFQUN4QixjQUFjLEVBQUUsS0FBSyxFQUNyQixjQUFjLEVBQUUsS0FBSyxFQUNyQixnQkFBZ0IsRUFBRSxLQUFLLEVBQ3ZCLHFCQUFxQixFQUFFLEtBQUssR0FDL0IsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLG9CQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFN0MsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztJQUU1RCwrQ0FBK0M7SUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLG9CQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUUsTUFBTSxPQUFPLEdBQUcsb0JBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbEMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtRQUMxQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssb0JBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7WUFDckQsT0FBTztTQUNWO1FBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ2pCLE1BQU0sRUFDRixJQUFJLEVBQ0osU0FBUyxHQUNaLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FDN0MsVUFBVSxDQUFDLEtBQU0sQ0FDcEIsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFHLG9CQUFFLENBQUMsNEJBQTRCLENBQzNDLFVBQVUsQ0FBQyxXQUFXLEVBQ3RCLElBQUksQ0FDUCxDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FDUCxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksU0FBUztnQkFDakQsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUN2QixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQ1QsY0FBRyxDQUNDLG9CQUFFLENBQUMsNEJBQTRCLENBQzNCLFVBQVUsQ0FBQyxXQUFXLEVBQ3RCLElBQUksQ0FDUCxDQUNKLENBQ0osQ0FBQztTQUNMO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLFVBQVUsQ0FBQyxXQUFXLEVBQUU7UUFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtBQUNMLENBQUMsQ0FBQyJ9