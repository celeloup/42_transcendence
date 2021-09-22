import { Injectable } from '@nestjs/common';
import Match from '../matches/match.entity';
import Round from './class/round.class';
import Paddle from './class/paddle.class';
import Puck from './class/puck.class';
 
const height: number = 360;
const width: number = 782;
const paddle_margin: number = 20;

@Injectable()
export default class GameService {

 }
