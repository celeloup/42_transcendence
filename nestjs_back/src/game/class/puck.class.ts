import { height, width, paddle_margin } from '../game.settings'
import Boost from './boost.class';
import Round from './round.class';

export default class Puck {
    x: number = width / 2;
    y: number = height / 2;
    r: number = 12;
	speed: number = 8;
    x_speed: number;
    x_direction: number;
    y_speed: number;
    indice: number = 1;

    boost_function: any[];
    boost_on: boolean = false;
    boost_activated: {"x": number, "y":number, "type": number} [] = [];
    boost_launched: {"stop_id": number, "score1":number, "score2": number} [] = [];

    constructor(speed: number) {
		let angle = Math.random() * ( Math.PI / 3 + Math.PI / 3 ) - Math.PI / 3;
        if (speed == 0) {
            this.speed = 5;
        }
        if (speed == 2) {
            this.speed = 12;
        }
        if (Math.random() < 0.5)
           this.x_direction = -1;
        else
            this.x_direction = 1;
		this.x_speed = this.x_direction * this.speed * Math.cos(angle);
		this.y_speed = this.speed * Math.sin(angle);

        this.boost_function = [
            this.boostUpPaddle1,
            this.boostDownPaddle1,
            this.boostUpPaddle2,
            this.boostDownPaddle2,
            this.boostUp,
            this.boostDown,
            this.boostStopPaddle1,
            this.boostStopPaddle2,
            this.boostStop
        ];
   }


//////tools
    getRandomInt(min: number, max: number) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    
    map(n: number, start1: number, stop1: number, start2: number, stop2: number) {
        return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
    };

///////////////////////BOOST PART////////////////////

    //boost puck
    boostUp(param: Round) {
        param.puck.indice = 1.5;
    }
    boostDown(param: Round) {
        param.puck.indice = 0.5;
    }
    boostStop(param: Round) {
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


	//check if bost can appear on the screen and been catch
    activateBoost() {
        if (this.x % 25 == 0 && this.y % 5 == 0) {
            this.boost_activated.push(
                new Boost(this.getRandomInt(80, 703), this.getRandomInt(80, 547), this.getRandomInt(0,7)
            ));
            if (this.boost_activated.length > 5 ) {
                this.boost_activated.shift();
            }
        }
    }


	//check if the boost I've been catch and start the effect of the boost
    launchBoost(param : Round) {
        let r_boost = this.r;
        for( var i = 0; i < this.boost_activated.length; i++) {
            let boost = this.boost_activated[i];
            if (this.x - this.r < boost.x + r_boost && this.x + this.r > boost.x - r_boost) {
               if (this.y - this.r < boost.y + r_boost && this.y + this.r > boost.y - r_boost) {
                this.setLaunchedBoost(param, boost);
                this.boost_activated.splice(i, 1);
                return ;
            }
           }
        };
    }

	//set up ending conditions of the boost and start the effects
    setLaunchedBoost(param: Round, boost: {"x": number, "y": number,"type": number}) {
        let score1 = param.score_player1;
        let score2 = param.score_player2;
        let ending: number;
        if (boost.type == 0) {
           ending = 6;
           score2 += 1;
        }
        else if (boost.type == 1) {
           ending = 6;
           score1 += 1;
        }
        else if (boost.type == 2) {
           ending = 7;
           score1 += 1;
        }
        else if (boost.type == 3) {
           ending = 7;
           score2 += 1;
        }
        else {
            ending = 8;
            score1 += 1;
            score2 += 1;
        }
        this.boost_launched.push({"stop_id": ending, "score1": score1, "score2": score2 });
        this.boost_function[boost.type] (param);
    }

	//check the ending condition of the boost
    stopBoost(param: Round) {
        for( var i = 0; i < this.boost_launched.length; i++) {
            let boost = this.boost_launched[i];
            if (param.score_player1 >= boost.score1 && param.score_player2 >= boost.score2) {
                this.boost_function[boost.stop_id] (param);
                this.boost_launched.splice(i, 1);
            }
        }
    }

//////////////////END OF BOOST PART//////////////




	update(param: Round) {
        this.x += this.indice * this.x_speed;
        this.y += this.indice * this.y_speed;
        param.paddle_player1.updatePosition();
        param.paddle_player2.updatePosition();
        this.edges(param);
        if (param.boost_available) {
            this.activateBoost();
            this.launchBoost(param);
            this.stopBoost(param);
        }
    }

    getAnglePaddle1(diff: number, paddle_height: number) {
        let segment_size = paddle_height / 8;
        let segment = Math.floor(diff/segment_size);
        if (segment == 0 || diff <= 0)
            return -(45 * Math.PI) / 180;
        if (segment == 1)
            return -(30 * Math.PI) / 180;
         if (segment == 2)
            return -(15 * Math.PI) / 180;
        if (segment == 5)
            return 15 * Math.PI / 180;
        if (segment == 6)
            return 30 * Math.PI / 180;
         if (segment >= 7)
            return 45 * Math.PI / 180;
        return 0;
    }

    getAnglePaddle2(diff: number, paddle_height: number) {
        let segment_size = paddle_height / 8;
        let segment = Math.floor(diff/segment_size);
        if (segment == 0 || diff <= 0)
            return -(135 * Math.PI) / 180;
        if (segment == 1)
            return -(150 * Math.PI) / 180;
         if (segment == 2)
            return -(165 * Math.PI) / 180;
        if (segment == 5)
            return 165 * Math.PI / 180;
        if (segment == 6)
            return 150 * Math.PI / 180;
         if (segment >= 7)
            return 135 * Math.PI / 180;
        return Math.PI;
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

        if (puck_left < paddle1_right && puck_top < paddle1_bottom && puck_bottom > paddle1_top) {
            if (this.x > param.paddle_player1.x) {
                let diff = this.y - paddle1_top;
                // let angle = this.map(diff, 0, param.paddle_player1.h, -Math.PI / 4, Math.PI / 4);    
                let angle = this.getAnglePaddle1(diff, param.paddle_player1.h);
                this.x_speed = this.speed * Math.cos(angle);
                this.y_speed = this.speed * Math.sin(angle);
                this.x = param.paddle_player1.x + param.paddle_player1.w/2 + this.r;
            }
            else    
                this.y_speed *= -1;
            return ;
        }

		if (puck_right > paddle2_left && puck_top < paddle2_bottom && puck_bottom > paddle2_top) {
			if (this.x < param.paddle_player2.x) {
                let diff = this.y - paddle2_top;
                let angle = this.getAnglePaddle2(diff, param.paddle_player1.h);
                this.x_speed = this.speed * Math.cos(angle);
                this.y_speed = this.speed * Math.sin(angle);
                this.x = param.paddle_player2.x - param.paddle_player2.w/2 - this.r;
			}
            else
                this.y_speed *= -1;
            return ;
        }
        
        if (this.x <= param.paddle_player1.x) {
            param.score_player2++;
            this.reset();
            return ;
        }

        if (this.x >= param.paddle_player2.x) {
            param.score_player1++;
            this.reset();
            return ;
        }
        
        if (puck_top < 0 || puck_bottom > height) {
            this.y_speed *= -1;
            //est-ce qu'on reeloigne du bord pour eviter les pb ?
        }
    }

    reset() {
//		let angle = Math.random() * ( Math.PI / 4 - (-Math.PI / 4) ) + (-Math.PI /4);
		//Math.random() * (max - min)) + min;
  
        //pourquoi langle ne fait pas un 360 ?
       // if (Math.random() < 0.5)
//            angle *= -1;

		// let angle = Math.random() * 2 * Math.PI;
		let angle = Math.random() * ( Math.PI / 3 + Math.PI / 3 ) - Math.PI / 3;
		this.x = width / 2;
        this.y = this.getRandomInt(40, height - 40);
        this.x_direction *= -1;
		this.x_speed = this.x_direction * this.speed * Math.cos(angle);
		this.y_speed = this.speed * Math.sin(angle);
    }
}
