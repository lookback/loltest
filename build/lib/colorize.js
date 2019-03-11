"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color;
(function (Color) {
    Color["Green"] = "\u001B[32m";
    Color["Red"] = "\u001B[31m";
    Color["Reset"] = "\u001B[0m";
})(Color || (Color = {}));
exports.colorize = (color, str) => `${color}${str}${Color.Reset}`;
exports.red = exports.colorize.bind(null, Color.Red);
exports.green = exports.colorize.bind(null, Color.Green);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2NvbG9yaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSyxLQUlKO0FBSkQsV0FBSyxLQUFLO0lBQ04sNkJBQWtCLENBQUE7SUFDbEIsMkJBQWdCLENBQUE7SUFDaEIsNEJBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUpJLEtBQUssS0FBTCxLQUFLLFFBSVQ7QUFJWSxRQUFBLFFBQVEsR0FBRyxDQUFDLEtBQVksRUFBRSxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFekUsUUFBQSxHQUFHLEdBQVksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QyxRQUFBLEtBQUssR0FBWSxnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=