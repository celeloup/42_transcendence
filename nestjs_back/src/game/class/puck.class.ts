import { height, width, paddle_margin } from '../game.settings'
import Boost from './boost.class';
import Round from './round.class';

export default class Puck {
    x: number = width / 2;
    y: number = height / 2;
    r: number = 12;
    x_speed: number = 6;
    y_speed: number = 6;
    x_direction: number = 1;
    y_direction: number = 1;
    indice: number = 1;

    boost_function: any[];
    boost_on: boolean = false;
    boost_sensor: { id: number, x: number, y: number }[] = [
        { "id": 0, "x": 0, "y": 1 },
        { "id": 1, "x": 0, "y": 1 },
        { "id": 2, "x": 0, "y": 1 },
        { "id": 3, "x": 0, "y": 1 },
        { "id": 4, "x": 0, "y": 1 }
    ];
    boost_activated: Map<number, Boost> = new Map();

    constructor(speed: number) {
        if (speed == 0) {
            this.x_speed = 3;
            this.y_speed = 3;
        }
        if (speed == 2) {
            this.x_speed = 9;
            this.y_speed = 9;
        }

        this.boost_function = [
            this.boostUpPaddle1,
            this.boostDownPaddle1,
            this.boostUpPaddle2,
            this.boostDownPaddle2,
            this.boostUp,
            this.boostDown,
        ];
    }


    ///tools
    getRandomInt(min: number, max: number) {
            return Math.floor(Math.random() * (max - min)) + min;
        }


///////////////////////BOOST PART////////////////////

    //boost puck
    boostUp(param: Round) {
        param.puck.indice = 1.5;
    }
    boostDown(param: Round) {
        param.puck.indice = 0.5;
    }
    endBoost(param: Round) {
        param.puck.indice = 1;
    }

    //boost paddle1
    boostUpPaddle1(param: Round) {
        param.paddle_player1.h = 120;
    }

    boostDownPaddle1(param: Round) {
        param.paddle_player1.h = 40;
    }

    boostStopPaddle1(param: Round) {
        param.paddle_player1.h = 80;
    }

    //boost paddle2
    boostUpPaddle2(param: Round) {
        param.paddle_player2.h = 120;
    }

    boostDownPaddle2(param: Round) {
        param.paddle_player2.h = 40;
    }

    boostStopPaddle2(param: Round) {
        param.paddle_player2.h = 80;
    }

    checkSensor() {
        
    }

    setBoost(param: Round) {
        checkSensor();
        if (!this.boost_on) {
            // this.boost_id = this.getRandomInt(0, 6);
            // this.boost_function[this.boost_id] (param);
            this.boost_on = true;
        }
    }

    update(param: Round) {
        this.x += this.x_direction * this.indice * this.x_speed;
        this.y += this.y_direction * this.indice * this.y_speed;
        param.paddle_player1.updatePosition();
        param.paddle_player2.updatePosition();
        this.edges(param);
        if (param.boost_available) {
            this.setBoost(param);
        }
    }

    edges(param: Round) {

        let puck_left = this.x - this.r;
        let puck_right = this.x + this.r;
        let puck_bottom = this.y + this.r;
        let puck_top = this.y - this.r;

        let paddle1_right = param.paddle_player1.x + param.paddle_player1.w / 2;
        let paddle1_top = param.paddle_player1.y - param.paddle_player1.h / 2;
        let paddle1_bottom = param.paddle_player1.y + param.paddle_player1.h / 2;

        let paddle2_left = param.paddle_player2.x - param.paddle_player2.w / 2;
        let paddle2_top = param.paddle_player2.y - param.paddle_player2.h / 2;
        let paddle2_bottom = param.paddle_player2.y + param.paddle_player2.h / 2;

        if (puck_top < 0) {
            this.y_direction = 1;
        }
        else if (puck_bottom > height) {

            this.y_direction = -1;
        }

        if (puck_left < paddle1_right && puck_top < paddle1_bottom && puck_bottom > paddle1_top) {
            this.x_direction = 1;
            if (puck_left < param.paddle_player1.x + param.paddle_player1.w / 4)
            {
                if (puck_bottom < param.paddle_player1.y)
                    this.y = paddle1_top - this.r;
                else
                    this.y = paddle1_bottom + this.r;
            }
        }

        if (puck_right > paddle2_left && puck_top < paddle2_bottom && puck_bottom > paddle2_top) {
            this.x_direction = -1;
            if (puck_right > param.paddle_player2.x - param.paddle_player2.w / 4)
            {
                if (puck_bottom < param.paddle_player2.y)
                    this.y = paddle2_top - this.r;
                else
                    this.y = paddle2_bottom + this.r;
            }
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
        

        this.x = width / 2;
        this.y = this.getRandomInt(40, height - 40);
        this.x_direction *= -1;
        this.y_direction *= -1;
    }
}
