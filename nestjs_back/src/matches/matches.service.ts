import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Match from './match.entity';
import * as bcrypt from 'bcrypt';
import CreateMatchDto from './dto/createMatch.dto';
import UpdateMatchDto from './dto/updateMatch.dto';
import UsersService from 'src/users/users.service';
import User from 'src/users/user.entity';
import AchievementsService from 'src/achievements/achievements.service';
 
@Injectable()
export default class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private achievementsService: AchievementsService

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
      users: [await this.usersService.getById(matchData.user1_id),
        await this.usersService.getById(matchData.user2_id)]
    });
    await this.matchesRepository.save(newMatch);
    return newMatch;
  }

  async weHaveAWinner(match: Match){
    const user1 = await this.usersService.getAllInfosByUserId(match.user1_id);
    const user2 = await this.usersService.getAllInfosByUserId(match.user2_id);
    if (!user1.achievements)
      user1.achievements = new Array;
    if (!user2.achievements)
      user2.achievements = new Array;
    if (!match.friendly){
      const tenVictories = await this.achievementsService.getAchievementById(2);
      const aHundredPoints = await this.achievementsService.getAchievementById(3);
      user1.points += match.score_user1;
      if (user1.points >= 100 && user1.points < 110)
        user1.achievements.push(aHundredPoints);
      user2.points += match.score_user2;
      if (user2.points >= 100 && user2.points < 110)
        user2.achievements.push(aHundredPoints);
      if (match.score_user1 === 10){
        user1.victories++;
        if (user1.victories === 10)
          user1.achievements.push(tenVictories);
        user2.defeats++;
      }
      else{
        user2.victories++;
        if (user2.victories === 10)
          user2.achievements.push(tenVictories);
        user1.defeats++;
      }
    }
    if (match.score_user1 === 10)
      match.winner = match.user1_id;
    else
      match.winner = match.user2_id;
    await this.matchesRepository.save(match);
    await this.usersRepository.save(user1);
    await this.usersRepository.save(user2);
    return match;
  }

  async updateMatch(id: number, matchData: UpdateMatchDto) {
    await this.matchesRepository.update(id, matchData);
    const updatedMatch = await this.getMatchById(id);
    if (updatedMatch) {
      if (updatedMatch.score_user1 === 10 || updatedMatch.score_user2 === 10)
        return await this.weHaveAWinner(updatedMatch);
      else
        return updatedMatch;
    }
    throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
  }
  
}