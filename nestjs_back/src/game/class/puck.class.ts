import { height, width, paddle_margin } from '../game.settings'
import Round from './round.class';

export default class Puck {
    x: number = width / 2;
    y: number = height / 2;
    r: number = 12;
    x_speed: number = 2;
    y_speed: number = 3;
    indice: number = 1;

    update(param: Round) {
        this.x += this.x_speed;
        this.y += this.y_speed;
        this.edges(param);
    }

    edges(param: Round) {

        let puck_left = this.x - this.r;
        let puck_right = this.x + this.r;
        let puck_bottom = this.y - this.r;
        let puck_top = this.y + this.r;

        let pladdle1_right = param.paddle_player1.x + param.paddle_player1.w / 2;
        let pladdle1_bottom = param.paddle_player1.y + param.paddle_player1.h / 2;
        let pladdle1_top = param.paddle_player1.x - param.paddle_player1.h / 2;

        let pladdle2_right = param.paddle_player1.x + param.paddle_player1.w / 2;
        let pladdle2_bottom = param.paddle_player1.y + param.paddle_player1.h / 2;
        let pladdle2_top = param.paddle_player1.x - param.paddle_player1.h / 2;

        if (puck_bottom < 0 || puck_top > height) {
            this.y_speed *= -1;
        }

        if (puck_left < pladdle1_right && puck_top < pladdle1_bottom && puck_bottom > pladdle1_top) {
            this.x_speed *= -1;
        }

        if (puck_right < pladdle2_right && puck_top < pladdle2_bottom && puck_bottom > pladdle2_top) {
            this.x_speed *= -1;
        }

        if (this.x < 0) {
            param.id_player2++;
            this.reset();
        }

        if (this.x > width) {
            param.id_player1++;
            this.reset();
        }
    }

    reset() {
        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
        }
        this.x = getRandomInt(width);
        this.y = getRandomInt(height);
        this.x_speed *= -1;
        this.y_speed *= -1;
    }
}
