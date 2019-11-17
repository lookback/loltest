import os from 'os';
import fs from 'fs';
import path from 'path';

/** Parse a .json file at `$HOME/<confFileName>`. */
export const parseGlobalConf = <T>(confFileName: string): Partial<T> => {
    const confPath = path.join(os.homedir(), confFileName);

    if (!fs.existsSync(confPath)) {
        return {};
    }

    try {
        return JSON.parse(fs.readFileSync(confPath, {encoding: 'utf8'}));
    } catch (ex) {
        console.error(`Failed to parse global config: ${confPath}`, ex);
        process.exit(1);
    }
};
