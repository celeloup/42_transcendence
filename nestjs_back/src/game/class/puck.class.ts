import { timeStamp } from 'console';
import GameService from '../game.service'
import {height, width, paddle_margin} from '../game.settings'

export default class Puck {
    x: number = width / 2;
    y: number = height / 2;
    x_speed: number = 2;
    y_speed: number = 3;
    indice: number = 1;

    update() {
        this.x += this.x_speed;
        this.y += this.y_speed;
        this.edges();
    }

    edges() {
        if (this.x < 0) {
            this.reset();
            return 2;
        }

        if (this.x > width) {
            this.reset();
            return 1;
        }
        
        if (this.y < 0 || this.y > height)
        {
         this.y_speed *= -1;   
        }
        return 0;
    }

    reset()
    {
      this.x = width / 2;
      this.y = height / 2;
      this.x_speed = 2;
      this.y_speed = 3;
    }
}