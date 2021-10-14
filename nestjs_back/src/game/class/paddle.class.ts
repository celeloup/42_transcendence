import {height, width, paddle_margin} from '../game.settings'

export default class Paddle {
	is_left: boolean;
    x: number;
    y: number = height / 2;
	w: number = 20;
	h: number = 80;
    indice: number = 1;
	speed: number = 10;

    constructor(is_left: boolean) {
		this.is_left = is_left;
    	if (is_left) {
			this.x = paddle_margin + this.w / 2;
		}
		else
			this.x = width - paddle_margin - this.w / 2;
	}

	move(move: string) {
		let margin = this.h / 2 + 10;

		if (move === "down") {
            if (this.y + this.speed + margin <= height) {
                this.y += this.speed;
            }
            else {
                this.y = height - margin;
            }
        }

        if (move === "up") {
            if (this.y - this.speed - margin >= 0) {
                this.y -= this.speed;
            }
            else {
                this.y = 0 + margin;
            }
        }

	}
}
