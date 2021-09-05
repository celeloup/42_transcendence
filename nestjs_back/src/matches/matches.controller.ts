import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import MatchesService from './matches.service';
 
@Controller('matches')
export default class MatchesController {
  constructor(
    private readonly matchesService: MatchesService
  ) {}



}