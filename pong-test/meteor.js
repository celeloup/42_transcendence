class Meteor {
	constructor() {
		this.y = 200;
		this.x = 200;
		this.w = 70;
		this.h = 160;
	}

	show() {
		// rectMode(CORNER);
		noFill();
		stroke(255);
		rect(this.x, this.y, this.w, this.h);
		ellipseMode(CENTER);
		circle(this.x, this.y + this.w - 25, this.w);
	}
}