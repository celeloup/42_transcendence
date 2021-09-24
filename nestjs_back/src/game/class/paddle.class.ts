import {height, width, paddle_margin} from '../game.settings'

export default class Paddle {
	is_left: boolean;
    x: number;
    y: number = height / 2;
	w: number = 20;
	h: number = 80;
    indice: number = 1;

    constructor(is_left: boolean) {
		this.is_left = is_left;
    	if (is_left) {
			this.x = paddle_margin + this.w / 2;
		}
		else
			this.x = width - paddle_margin - this.w / 2;
	}
}
