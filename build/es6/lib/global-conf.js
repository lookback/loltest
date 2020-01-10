import os from 'os';
import fs from 'fs';
import path from 'path';
/** Parse a .json file at `$HOME/<confFileName>`. */
export const parseGlobalConf = (confFileName) => {
    const confPath = path.join(os.homedir(), confFileName);
    if (!fs.existsSync(confPath)) {
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(confPath, { encoding: 'utf8' }));
    }
    catch (ex) {
        console.error(`Failed to parse global config: ${confPath}`, ex);
        process.exit(1);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWNvbmYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2dsb2JhbC1jb25mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUNwQixPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDcEIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBRXhCLG9EQUFvRDtBQUNwRCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsQ0FBSSxZQUFvQixFQUFjLEVBQUU7SUFDbkUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFdkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDMUIsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUVELElBQUk7UUFDQSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BFO0lBQUMsT0FBTyxFQUFFLEVBQUU7UUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0FBQ0wsQ0FBQyxDQUFDIn0=