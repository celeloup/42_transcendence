import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Match from './match.entity';
import * as bcrypt from 'bcrypt';
import CreateMatchDto from './dto/createMatch.dto';
import UpdateMatchDto from './dto/updateMatch.dto';
import UsersService from 'src/users/users.service';
import User from 'src/users/user.entity';
 
@Injectable()
export default class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    // @InjectRepository(User)
    // private usersRepository: Repository<User>
    private usersService: UsersService

  ) {}

  async getMatchById(id: number) {
    const match = await this.matchesRepository.findOne(id);
    if (match) {
      return match;
    }
    throw new HttpException('Match with this id does not exist', HttpStatus.NOT_FOUND);
  }
  
  async createMatch(matchData: CreateMatchDto) {
    const newMatch = await this.matchesRepository.create({
      ...matchData,
      score_user1:0,
      score_user2:0,
      user1: await this.usersService.getById(matchData.user1_id),
      user2: await this.usersService.getById(matchData.user2_id),
    });
    await this.matchesRepository.save(newMatch);
    return newMatch;
  }

/*   async changeName(id: number, matchData: UpdateMatchDto) {
    await this.matchesRepository.update(id, matchData);
    const updatedMatch = await this.getMatchById(id);
    if (updatedMatch) {
      return updatedMatch;
    }
    throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
  } */

  
}