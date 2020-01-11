"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** Parse a .json file at `$HOME/<confFileName>`. */
exports.parseGlobalConf = (confFileName) => {
    const confPath = path_1.default.join(os_1.default.homedir(), confFileName);
    if (!fs_1.default.existsSync(confPath)) {
        return {};
    }
    try {
        return JSON.parse(fs_1.default.readFileSync(confPath, { encoding: 'utf8' }));
    }
    catch (ex) {
        console.error(`Failed to parse global config: ${confPath}`, ex);
        process.exit(1);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWNvbmYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2dsb2JhbC1jb25mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLDRDQUFvQjtBQUNwQixnREFBd0I7QUFFeEIsb0RBQW9EO0FBQ3ZDLFFBQUEsZUFBZSxHQUFHLENBQUksWUFBb0IsRUFBYyxFQUFFO0lBQ25FLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRXZELElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN0RTtJQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtBQUNMLENBQUMsQ0FBQyJ9