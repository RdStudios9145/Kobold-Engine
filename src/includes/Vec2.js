var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        if (!x) {
            this.x = 0;
            this.y = 0;
            return;
        }
        if (!y && x) {
            this.x = x;
            this.y = x;
            return;
        }
        if (!(y && x))
            return;
        this.x = x;
        this.y = y;
    }
    return Vec2;
}());
