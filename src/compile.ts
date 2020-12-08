import ts from 'typescript';
import { RunConfiguration } from './main';
import { red } from './lib/colorize';
import fs from 'fs';
import { Reporter, Output } from './reporters';
import path from 'path';

type WatchCallback = () => void;

export const compileTs = (
    testFiles: string[],
    config: RunConfiguration,
    reporter: Reporter,
    watchCallback: WatchCallback | undefined,
    out: Output,
) => {
    const startTime = Date.now();
    reporter.onCompileStart(out);

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

    const options: ts.CompilerOptions = {
        ...parsedTsConf.options,
        // test/build
        outDir: config.buildDir,
        // use a tsbuildfile
        incremental: true,
        tsBuildInfoFile: path.join(config.buildDir, 'tsbuildinfo'),
        // this is just annoying when running tests
        noUnusedLocals: false,
    };

    const host = ts.createIncrementalCompilerHost(options);

    let numFiles = 0;

    const writeFile = host.writeFile;

    host.writeFile = (fileName, ...rest) => {
        numFiles++;
        return writeFile(fileName, ...rest);
    };
    // const program = ts.createProgram(rootFiles, options, host);
    const program = ts.createIncrementalProgram({
        rootNames: testFiles,
        options,
        host,
    });

    const emitResult = program.emit();

    let allDiagnostics = emitResult.diagnostics;

    const cwd = process.cwd();

    const hasCompileErrors = allDiagnostics.reduce(
        (p, diagnostic) => outputDiagnostic(diagnostic, cwd, out) || p,
        false,
    );

    if (watchCallback) {
        // start watching
        const allFiles = program.getSourceFiles().map((s) => s.fileName);
        watch(allFiles, options, cwd, watchCallback, out);
    } else if (emitResult.emitSkipped || hasCompileErrors) {
        // end on compilation error
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

const outputDiagnostic = (diagnostic: ts.Diagnostic, cwd: string, out: Output): boolean => {
    if (diagnostic.category !== ts.DiagnosticCategory.Error) {
        return false;
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
            return false;
        }

        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        const loc = red(`${file} (${line + 1},${character + 1})`);

        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

        out(`${loc}: ${message}`);

        return true;
    } else {
        out(red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));

        return true;
    }
};

const isNodeModules = (s: string) => s.includes('node_modules');

const watch = (
    allFiles: string[],
    options: ts.CompilerOptions,
    cwd: string,
    watchCallback: WatchCallback,
    out: Output,
) => {
    const files: ts.MapLike<{ version: number }> = {};

    const rootFileNames = allFiles.filter((n) => !isNodeModules(n));

    // initialize the list of files
    rootFileNames.forEach((fileName) => {
        files[fileName] = { version: 0 };
    });

    // Create the language service host to allow the LS to communicate with the host
    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: (fileName) => {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        directoryExists: ts.sys.directoryExists,
        getDirectories: ts.sys.getDirectories,
    };

    // Create the language service files
    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    for (const fileName of rootFileNames) {
        out(`Watch ${fileName}`);
        fs.watchFile(fileName, { persistent: true, interval: 250 }, (curr, prev) => {
            // Check timestamp
            if (+curr.mtime <= +prev.mtime) {
                return;
            }

            out(`Compile ${fileName}`);

            // increase version to tell language host it's updated.
            files[fileName].version += 1;

            let output = services.getEmitOutput(fileName);

            let allDiagnostics = services
                .getCompilerOptionsDiagnostics()
                .concat(services.getSyntacticDiagnostics(fileName))
                .concat(services.getSemanticDiagnostics(fileName));

            output.outputFiles.forEach((o) => {
                fs.writeFileSync(o.name, o.text, 'utf8');
            });

            // output any errors
            const hadErrors =
                output.emitSkipped &&
                allDiagnostics.reduce((p, d) => outputDiagnostic(d, cwd, out) || p, false);

            // retest
            if (!hadErrors) {
                watchCallback();
            }
        });
    }
};
