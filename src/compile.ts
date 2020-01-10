import ts from 'typescript';
import { RunConfiguration } from './main';
import { red } from './lib/colorize';
import fs from 'fs';

export const compileTs = (testFiles: string[], config: RunConfiguration) => {
    const tsconfigPath = ts.findConfigFile(
        /*searchPath*/ './',
        ts.sys.fileExists,
        'tsconfig.json'
    );
    if (!tsconfigPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const tsconfigOrig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    const parseConfigHost: ts.ParseConfigFileHost = {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: () => {},
    };

    const parsedTsConf = ts.parseJsonConfigFileContent(
        tsconfigOrig,
        parseConfigHost,
        './'
    );

    const compOpts: ts.CompilerOptions = {
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

    // tslint:disable-next-line: no-object-mutation
    host.writeFile = (fileName, content) => ts.sys.writeFile(fileName, content);
    const program = ts.createProgram(fileNames, compOpts, host);
    const emitResult = program.emit();

    emitResult.diagnostics.forEach((diagnostic) => {
        if (diagnostic.category !== ts.DiagnosticCategory.Error) {
            return;
        }
        if (diagnostic.file) {
            const {
                line,
                character,
            } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            );
            const message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                '\n'
            );
            console.log(
                `${diagnostic.file.fileName} (${line + 1},${character +
                    1}): ${message}`
            );
        } else {
            console.error(
                red(
                    ts.flattenDiagnosticMessageText(
                        diagnostic.messageText,
                        '\n'
                    )
                )
            );
        }
    });

    if (emitResult.emitSkipped) {
        process.exit(1);
    }
};
