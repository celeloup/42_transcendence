import {height, width, paddle_margin} from '../game.settings'

export default class Paddle {
	is_left: boolean;
    x: number;
    y: number = height / 2;
	w: number = 20;
	h: number = 80;
    indice: number = 1;
	speed: number = 10;
    direction: number = 0;

    constructor(is_left: boolean) {
		this.is_left = is_left;
    	if (is_left) {
			this.x = paddle_margin + this.w / 2;
		}
		else
			this.x = width - paddle_margin - this.w / 2;
	}

    boostUp() {
        this.h = 120;
    }
    boostDown () {
        this.h = 40;
    }
    endBoost () {
        this.h = 80;
    }

    setDirection(move: string) {
        if (move === "stop") {
            this.direction = 0;
            return ;
        }
        if (move === "up") {
            this.direction = -1;
            return ;
        }
        if (move === "down") {
            this.direction = 1;
            return ;
        }
    }

	updatePosition() {
        if (this.speed == 0)
            return ;

        let margin = this.h / 2 + 10;
        let border = this.y + this.direction * (this.speed + margin)
        if (border > height) {
            this.y = height - margin;
            return ;
        }
        if (border < 0) {
            this.y = 0 + margin;
            return ;
        }
        this.y += this.direction * this.speed;
	}
}
