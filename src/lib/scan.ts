import fs from 'fs';

// TODO: recursive dir scanning
export const scan = (dir: string): string[] => {
    const allFiles = fs.readdirSync(dir);
    return allFiles.filter(n => !n.startsWith('_') && (n.endsWith('ts') || n.endsWith('js')));
};
