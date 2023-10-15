"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transform = /** @class */ (function () {
    // function Transform() {
    // this.name = "Transform";
    // this.translation = new Vec2();
    // this.scale = new Vec2();
    // }
    function Transform() {
        this.translation = new Vec2();
        this.scale = new Vec2();
    }
    Transform.prototype.from_translation = function (x, y) {
        var t = new Transform();
        if (typeof x === typeof Vec2) {
            t.translation = x;
            return t;
        }
        if (typeof x === "number" && y) {
            t.translation = new Vec2(x, y);
            return t;
        }
    };
    ;
    return Transform;
}());
;
// module.exports = Transform;
