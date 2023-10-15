class Vec2 {
	x: number;
	y: number;

	constructor(x?: number, y?: number) {
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

		if (!(y && x)) return;
		this.x = x;
		this.y = y;
	}
}

module.exports = Vec2;