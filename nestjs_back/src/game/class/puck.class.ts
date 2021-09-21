import { timeStamp } from 'console';
import GameService from '../game.service'

game: GameService;

export default class Puck {
    private readonly game: GameService;

    x: number;
    y: number;
    x_speed: number = 2;
    y_speed: number = 3;
    indice: number = 1;

    constructor() {
      this.x = this.game.getWidth() / 2;
      this.y = this.game.getHeight() / 2;
    }

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

        if (this.x > this.game.getWidth()) {
            this.reset();
            return 1;
        }
        
        if (this.y < 0 || this.y > this.game.getHeight())
        {
         this.y_speed *= -1;   
        }
        return 0;
    }

    reset()
    {
      this.x = this.game.getWidth() / 2;
      this.y = this.game.getHeight() / 2;
      this.x_speed = 2;
      this.y_speed = 3;
    }
}