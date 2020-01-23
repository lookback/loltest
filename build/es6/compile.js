import ts from 'typescript';
import { red } from './lib/colorize';
import fs from 'fs';
export const compileTs = (testFiles, config, reporter, out) => {
    const tsconfigPath = ts.findConfigFile(
    /*searchPath*/ './', ts.sys.fileExists, 'tsconfig.json');
    if (!tsconfigPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    const tsconfigOrig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    const parseConfigHost = {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: () => { },
    };
    const parsedTsConf = ts.parseJsonConfigFileContent(tsconfigOrig, parseConfigHost, './');
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
    const host = ts.createCompilerHost(compOpts);
    const fileNames = [...parsedTsConf.fileNames, ...testFiles];
    let numFiles = 0; // tslint:disable-line
    // tslint:disable-next-line: no-object-mutation
    host.writeFile = (fileName, content) => {
        numFiles++;
        return ts.sys.writeFile(fileName, content);
    };
    const program = ts.createProgram(fileNames, compOpts, host);
    reporter.onCompileStart(out);
    const startTime = Date.now();
    const emitResult = program.emit();
    emitResult.diagnostics.forEach((diagnostic) => {
        if (diagnostic.category !== ts.DiagnosticCategory.Error) {
            return;
        }
        if (diagnostic.file) {
            const { line, character, } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character +
                1}): ${message}`);
        }
        else {
            console.error(red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUU1QixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBR3BCLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQUNyQixTQUFtQixFQUNuQixNQUF3QixFQUN4QixRQUFrQixFQUNsQixHQUFXLEVBQ2IsRUFBRTtJQUNBLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxjQUFjO0lBQ2xDLGNBQWMsQ0FBQyxJQUFJLEVBQ25CLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUNqQixlQUFlLENBQ2xCLENBQUM7SUFDRixJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0tBQzlEO0lBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sZUFBZSxHQUEyQjtRQUM1QyxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsbUNBQW1DLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztLQUNoRCxDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUM5QyxZQUFZLEVBQ1osZUFBZSxFQUNmLElBQUksQ0FDUCxDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQXVCO1FBQ2pDLEdBQUcsWUFBWSxDQUFDLE9BQU87UUFDdkIsYUFBYTtRQUNiLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUTtRQUN2QiwyQ0FBMkM7UUFDM0MsYUFBYSxFQUFFLEtBQUs7UUFDcEIsaUJBQWlCLEVBQUUsS0FBSztRQUN4QixjQUFjLEVBQUUsS0FBSztRQUNyQixjQUFjLEVBQUUsS0FBSztRQUNyQixnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLHFCQUFxQixFQUFFLEtBQUs7S0FDL0IsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU3QyxNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLFNBQVMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBRTVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjtJQUV4QywrQ0FBK0M7SUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUNuQyxRQUFRLEVBQUUsQ0FBQztRQUNYLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU1RCxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM3QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbEMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtRQUMxQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtZQUNyRCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDakIsTUFBTSxFQUNGLElBQUksRUFDSixTQUFTLEdBQ1osR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUM3QyxVQUFVLENBQUMsS0FBTSxDQUNwQixDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixDQUMzQyxVQUFVLENBQUMsV0FBVyxFQUN0QixJQUFJLENBQ1AsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQ1AsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLFNBQVM7Z0JBQ2pELENBQUMsTUFBTSxPQUFPLEVBQUUsQ0FDdkIsQ0FBQztTQUNMO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUNULEdBQUcsQ0FDQyxFQUFFLENBQUMsNEJBQTRCLENBQzNCLFVBQVUsQ0FBQyxXQUFXLEVBQ3RCLElBQUksQ0FDUCxDQUNKLENBQ0osQ0FBQztTQUNMO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLFVBQVUsQ0FBQyxXQUFXLEVBQUU7UUFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUVELFFBQVEsQ0FBQyxZQUFZLENBQ2pCO1FBQ0ksUUFBUTtRQUNSLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUztLQUNuQyxFQUNELEdBQUcsQ0FDTixDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=