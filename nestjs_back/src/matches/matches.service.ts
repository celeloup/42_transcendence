import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Match from './match.entity';
import * as bcrypt from 'bcrypt';
import CreateMatchDto from './dto/createMatch.dto';
import UpdateMatchDto from './dto/updateMatch.dto';
 
@Injectable()
export default class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>
  ) {}

  async getById(pg_id: number) {
    const match = await this.matchesRepository.findOne({ pg_id });
    if (match) {
      return match;
    }
    throw new HttpException('Match with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getByOurId(id: number) {
    const match = await this.matchesRepository.findOne({ id });
    if (match) {
      return match;
    }
  }
  
  async create(matchData: CreateMatchDto) {
    const newMatch = await this.matchesRepository.create(matchData);
    await this.matchesRepository.save(newMatch);
    return newMatch;
  }

  async changeName(id: number, matchData: UpdateMatchDto) {
    await this.matchesRepository.update(id, matchData);
    const updatedMatch = await this.getById(id);
    if (updatedMatch) {
      return updatedMatch;
    }
    throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
  }

  
}