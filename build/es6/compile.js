import ts from 'typescript';
import { red } from './lib/colorize';
import fs from 'fs';
export const compileTs = (testFiles, config) => {
    const tsconfigPath = ts.findConfigFile(
    /*searchPath*/ './', ts.sys.fileExists, 'tsconfig.json');
    if (!tsconfigPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    const tsconfigOrig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    const parseConfigHost = Object.assign(Object.assign({}, ts.sys), { onUnRecoverableConfigFileDiagnostic: () => { } });
    const parsedTsConf = ts.parseJsonConfigFileContent(tsconfigOrig, parseConfigHost, './');
    const compOpts = Object.assign(Object.assign({}, parsedTsConf.options), { 
        // test/build
        outDir: config.buildDir, 
        // this is just annoying when running tests
        noImplicitAny: false, noImplicitReturns: false, noImplicitThis: false, noUnusedLocals: false, strictNullChecks: false, noStrictGenericChecks: false });
    const host = ts.createCompilerHost(compOpts);
    const fileNames = [...parsedTsConf.fileNames, ...testFiles];
    // tslint:disable-next-line: no-object-mutation
    host.writeFile = (fileName, content) => ts.sys.writeFile(fileName, content);
    const program = ts.createProgram(fileNames, compOpts, host);
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUU1QixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRXBCLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQUFDLFNBQW1CLEVBQUUsTUFBd0IsRUFBRSxFQUFFO0lBQ3ZFLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxjQUFjO0lBQ2xDLGNBQWMsQ0FBQyxJQUFJLEVBQ25CLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUNqQixlQUFlLENBQ2xCLENBQUM7SUFDRixJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0tBQzlEO0lBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sZUFBZSxtQ0FDZCxFQUFFLENBQUMsR0FBRyxLQUNULG1DQUFtQyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUMsR0FDaEQsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQywwQkFBMEIsQ0FDOUMsWUFBWSxFQUNaLGVBQWUsRUFDZixJQUFJLENBQ1AsQ0FBQztJQUVGLE1BQU0sUUFBUSxtQ0FDUCxZQUFZLENBQUMsT0FBTztRQUN2QixhQUFhO1FBQ2IsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1FBQ3ZCLDJDQUEyQztRQUMzQyxhQUFhLEVBQUUsS0FBSyxFQUNwQixpQkFBaUIsRUFBRSxLQUFLLEVBQ3hCLGNBQWMsRUFBRSxLQUFLLEVBQ3JCLGNBQWMsRUFBRSxLQUFLLEVBQ3JCLGdCQUFnQixFQUFFLEtBQUssRUFDdkIscUJBQXFCLEVBQUUsS0FBSyxHQUMvQixDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsU0FBUyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFFNUQsK0NBQStDO0lBQy9DLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUUsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVsQyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1FBQzFDLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1lBQ3JELE9BQU87U0FDVjtRQUNELElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNqQixNQUFNLEVBQ0YsSUFBSSxFQUNKLFNBQVMsR0FDWixHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQzdDLFVBQVUsQ0FBQyxLQUFNLENBQ3BCLENBQUM7WUFDRixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsNEJBQTRCLENBQzNDLFVBQVUsQ0FBQyxXQUFXLEVBQ3RCLElBQUksQ0FDUCxDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FDUCxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksU0FBUztnQkFDakQsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUN2QixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQ1QsR0FBRyxDQUNDLEVBQUUsQ0FBQyw0QkFBNEIsQ0FDM0IsVUFBVSxDQUFDLFdBQVcsRUFDdEIsSUFBSSxDQUNQLENBQ0osQ0FDSixDQUFDO1NBQ0w7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksVUFBVSxDQUFDLFdBQVcsRUFBRTtRQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0FBQ0wsQ0FBQyxDQUFDIn0=