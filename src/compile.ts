import ts from 'typescript';
import { RunConfiguration } from './main';
import { red } from './lib/colorize';
import fs from 'fs';
import { Reporter, Output } from './reporters';

export const compileTs = (testFiles: string[], config: RunConfiguration, reporter: Reporter, out: Output) => {
    const tsconfigPath = ts.findConfigFile(/*searchPath*/ './', ts.sys.fileExists, 'tsconfig.json');
    if (!tsconfigPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const tsconfigOrig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    const parseConfigHost: ts.ParseConfigFileHost = {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: () => {},
    };

    const parsedTsConf = ts.parseJsonConfigFileContent(tsconfigOrig, parseConfigHost, './');

    const compOpts: ts.CompilerOptions = {
        ...parsedTsConf.options,
        // test/build
        outDir: config.buildDir,
        // this is just annoying when running tests
        noUnusedLocals: false,
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

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    const cwd = process.cwd();
    let hasCompileErrors = false;

    allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.category !== ts.DiagnosticCategory.Error) {
            return;
        }
        if (diagnostic.file) {
            let file = diagnostic.file.fileName;
            if (file.startsWith(cwd)) {
                file = file.substring(cwd.length);
                if (file.startsWith('/')) {
                    file = file.substring(1);
                }
            }
            if (file.startsWith('node_modules')) {
                return;
            }
            hasCompileErrors = true;

            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            const loc = red(`${file} (${line + 1},${character + 1})`);

            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

            out(`${loc}: ${message}`);
        } else {
            hasCompileErrors = true;
            out(red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
        }
    });

    if (emitResult.emitSkipped || hasCompileErrors) {
        process.exit(1);
    }

    reporter.onCompileEnd(
        {
            numFiles,
            duration: Date.now() - startTime,
        },
        out,
    );
};
