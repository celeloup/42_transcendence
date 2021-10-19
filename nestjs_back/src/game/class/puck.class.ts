import { height, width, paddle_margin } from '../game.settings'
import Round from './round.class';

export default class Puck {
    x: number = width / 2;
    y: number = height / 2;
    r: number = 12;
    x_speed: number = 3;
    y_speed: number = 3;
    indice: number = 1;

    constructor(speed: number) {
        if (speed == 0) {
            this.x_speed = 1;
            this.y_speed = 1;
        }
        if (speed == 2) {
            this.x_speed = 5;
            this.y_speed = 5;
        }
    }

    boostUp(param: Round) {
        param.puck.indice = 1.5;
    }
    boostDown (param: Round) {
        param.puck.indice = 0.5;
    }
    endBoost (param: Round) {
        param.puck.indice = 1;
    }

    update(param: Round) {
        this.x += this.indice * this.x_speed;
        this.y += this.indice * this.y_speed;
        param.paddle_player1.updatePosition();
        param.paddle_player2.updatePosition();
        this.edges(param);
        param.boost();
    }

    edges(param: Round) {

        let puck_left = this.x - this.r;
        let puck_right = this.x + this.r;
        let puck_bottom = this.y + this.r;
        let puck_top = this.y - this.r;

        let pladdle1_right = param.paddle_player1.x + param.paddle_player1.w / 2;
        let pladdle1_top = param.paddle_player1.y - param.paddle_player1.h / 2;
        let pladdle1_bottom = param.paddle_player1.y + param.paddle_player1.h / 2;

        let pladdle2_left = param.paddle_player2.x - param.paddle_player2.w / 2;
        let pladdle2_top = param.paddle_player2.y - param.paddle_player2.h / 2;
        let pladdle2_bottom = param.paddle_player2.y + param.paddle_player2.h / 2;

        if (puck_top < 0 || puck_bottom > height) {
            this.y_speed *= -1;
        }

        if (puck_left < pladdle1_right && puck_top < pladdle1_bottom && puck_bottom > pladdle1_top) {
            this.x_speed *= -1;
        }

        if (puck_right > pladdle2_left && puck_top < pladdle2_bottom && puck_bottom > pladdle2_top) {
            this.x_speed *= -1;
        }

        if (this.x < 0) {
            param.score_player2++;
            this.reset();
        }

        if (this.x > width) {
            param.score_player1++;
            this.reset();
        }
    }

    reset() {
        function getRandomInt(min: number, max: number) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        this.x = width / 2;
        this.y = getRandomInt(40, height - 40);
        this.x_speed *= -1;
        this.y_speed *= -1;
    }
}
