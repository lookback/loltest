"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color;
(function (Color) {
    Color["Green"] = "\u001B[32m";
    Color["Red"] = "\u001B[31m";
    Color["Reset"] = "\u001B[0m";
    Color["Yellow"] = "\u001B[33m";
    Color["Dim"] = "\u001B[90m";
    Color["White"] = "\u001B[97m";
})(Color || (Color = {}));
exports.colorize = (color, str) => `${color}${String(str)}${Color.Reset}`;
exports.red = exports.colorize.bind(null, Color.Red);
exports.green = exports.colorize.bind(null, Color.Green);
exports.yellow = exports.colorize.bind(null, Color.Yellow);
exports.dim = exports.colorize.bind(null, Color.Dim);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2NvbG9yaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSyxLQU9KO0FBUEQsV0FBSyxLQUFLO0lBQ04sNkJBQWtCLENBQUE7SUFDbEIsMkJBQWdCLENBQUE7SUFDaEIsNEJBQWlCLENBQUE7SUFDakIsOEJBQW1CLENBQUE7SUFDbkIsMkJBQWdCLENBQUE7SUFDaEIsNkJBQWtCLENBQUE7QUFDdEIsQ0FBQyxFQVBJLEtBQUssS0FBTCxLQUFLLFFBT1Q7QUFJWSxRQUFBLFFBQVEsR0FBRyxDQUFDLEtBQVksRUFBRSxHQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFOUUsUUFBQSxHQUFHLEdBQVksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QyxRQUFBLEtBQUssR0FBWSxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFFBQUEsTUFBTSxHQUFZLGdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEQsUUFBQSxHQUFHLEdBQVksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyJ9