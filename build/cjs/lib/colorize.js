"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FgColor;
(function (FgColor) {
    FgColor[FgColor["Black"] = 30] = "Black";
    FgColor[FgColor["Red"] = 31] = "Red";
    FgColor[FgColor["Green"] = 32] = "Green";
    FgColor[FgColor["Yellow"] = 33] = "Yellow";
    FgColor[FgColor["Default"] = 39] = "Default";
    FgColor[FgColor["Grey"] = 37] = "Grey";
    FgColor[FgColor["Dim"] = 90] = "Dim";
    FgColor[FgColor["White"] = 97] = "White";
})(FgColor = exports.FgColor || (exports.FgColor = {}));
var BgColor;
(function (BgColor) {
    BgColor[BgColor["Red"] = 41] = "Red";
    BgColor[BgColor["Green"] = 42] = "Green";
    BgColor[BgColor["Yellow"] = 43] = "Yellow";
    BgColor[BgColor["Blue"] = 44] = "Blue";
    BgColor[BgColor["Grey"] = 47] = "Grey";
    BgColor[BgColor["DarkGrey"] = 100] = "DarkGrey";
    BgColor[BgColor["White"] = 107] = "White";
    BgColor[BgColor["Default"] = 49] = "Default";
})(BgColor = exports.BgColor || (exports.BgColor = {}));
var Effect;
(function (Effect) {
    Effect[Effect["Reset"] = 0] = "Reset";
    Effect[Effect["Bold"] = 1] = "Bold";
    Effect[Effect["Dim"] = 2] = "Dim";
    Effect[Effect["Underline"] = 4] = "Underline";
    Effect[Effect["Hidden"] = 8] = "Hidden";
})(Effect = exports.Effect || (exports.Effect = {}));
const sequence = (c1, c2, c3) => `\x1b[${[c1, c2, c3].filter(Boolean).join(';')}m`;
const isComposition = (t) => !!t && !!t.back && !!t.front;
exports.colorize = (color, str) => `${isComposition(color)
    ? sequence(color.front, color.back, color.effect)
    : sequence(color)}${String(str)}${sequence(Effect.Reset)}`;
exports.red = exports.colorize.bind(null, FgColor.Red);
exports.green = exports.colorize.bind(null, FgColor.Green);
exports.yellow = exports.colorize.bind(null, FgColor.Yellow);
exports.dim = exports.colorize.bind(null, FgColor.Dim);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2NvbG9yaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxPQVNYO0FBVEQsV0FBWSxPQUFPO0lBQ2Ysd0NBQVUsQ0FBQTtJQUNWLG9DQUFRLENBQUE7SUFDUix3Q0FBVSxDQUFBO0lBQ1YsMENBQVcsQ0FBQTtJQUNYLDRDQUFZLENBQUE7SUFDWixzQ0FBUyxDQUFBO0lBQ1Qsb0NBQVEsQ0FBQTtJQUNSLHdDQUFVLENBQUE7QUFDZCxDQUFDLEVBVFcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBU2xCO0FBRUQsSUFBWSxPQVNYO0FBVEQsV0FBWSxPQUFPO0lBQ2Ysb0NBQVEsQ0FBQTtJQUNSLHdDQUFVLENBQUE7SUFDViwwQ0FBVyxDQUFBO0lBQ1gsc0NBQVMsQ0FBQTtJQUNULHNDQUFTLENBQUE7SUFDVCwrQ0FBYyxDQUFBO0lBQ2QseUNBQVcsQ0FBQTtJQUNYLDRDQUFZLENBQUE7QUFDaEIsQ0FBQyxFQVRXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQVNsQjtBQUVELElBQVksTUFNWDtBQU5ELFdBQVksTUFBTTtJQUNkLHFDQUFTLENBQUE7SUFDVCxtQ0FBUSxDQUFBO0lBQ1IsaUNBQU8sQ0FBQTtJQUNQLDZDQUFhLENBQUE7SUFDYix1Q0FBVSxDQUFBO0FBQ2QsQ0FBQyxFQU5XLE1BQU0sR0FBTixjQUFNLEtBQU4sY0FBTSxRQU1qQjtBQVVELE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBYyxFQUFFLEVBQWMsRUFBRSxFQUFjLEVBQVUsRUFBRSxDQUN4RSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFFdEQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFNLEVBQW9CLEVBQUUsQ0FDL0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUlwQixRQUFBLFFBQVEsR0FBRyxDQUFDLEtBQThCLEVBQUUsR0FBUSxFQUFFLEVBQUUsQ0FDakUsR0FDSSxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDakQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQ3hCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUVqQyxRQUFBLEdBQUcsR0FBWSxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELFFBQUEsS0FBSyxHQUFZLGdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsUUFBQSxNQUFNLEdBQVksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RCxRQUFBLEdBQUcsR0FBWSxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDIn0=