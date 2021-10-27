export default class Boost {
    x: number;
    y: number;
    type: number;
    ending_condition: {"score1": number, "score2": number};
    launch: boolean = false;

    constructor( x: number, y: number, type: number) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}