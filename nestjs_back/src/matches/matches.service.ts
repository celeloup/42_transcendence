import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Match from './match.entity';
import * as bcrypt from 'bcrypt';
import CreateMatchDto from './dto/createMatch.dto';
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

  ) { }

  async getAllMatches() {
    const match = await this.matchesRepository.find({
      relations: ['users'], order: {
        createdDate: "DESC"
      }
    });
    if (match) {
      return match;
    }
    throw new HttpException('No matches found', HttpStatus.NOT_FOUND);
  }

  async getMatchById(id: number) {
    const match = await this.matchesRepository.findOne(id, {
      relations: ['users'], order: {
        createdDate: "DESC"
      }
    });
    if (match) {
      return match;
    }
    throw new HttpException('Match with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async createMatch(matchData: CreateMatchDto) {
    const newMatch = await this.matchesRepository.create({
      ...matchData,
      users: [await this.usersService.getById(matchData.user1_id),
      await this.usersService.getById(matchData.user2_id)]
    });
    await this.matchesRepository.save(newMatch);

    const user1 = await this.usersService.getById(matchData.user1_id);
    let achievement = null;
    if (user1.matches.length === 1) {
      achievement = await this.achievementsService.getAchievementByName("Newbie");
    } else if (user1.matches.length === 10) {
      achievement = await this.achievementsService.getAchievementByName("Casual");
    } else if (user1.matches.length === 100) {
      achievement = await this.achievementsService.getAchievementByName("Nolife");
    }
    if (achievement) {
      user1.achievements.push(achievement);
      await this.usersRepository.save(user1);
    }
    
    const user2 = await this.usersService.getById(matchData.user2_id);
    achievement = null;
    if (user2.matches.length === 1) {
      achievement = await this.achievementsService.getAchievementByName("Newbie");
    } else if (user2.matches.length === 10) {
      achievement = await this.achievementsService.getAchievementByName("Casual");
    } else if (user2.matches.length === 100) {
      achievement = await this.achievementsService.getAchievementByName("Nolife");
    }
    if (achievement) {
      user2.achievements.push(achievement);
      await this.usersRepository.save(user2);
    }
    return newMatch;
  }

  async weHaveAWinner(match: & Match) {
    const user1 = await this.usersService.getAllInfosByUserId(match.user1_id);
    const user2 = await this.usersService.getAllInfosByUserId(match.user2_id);
    user1.points += match.score_user1;
    user2.points += match.score_user2;
    if (match.score_user1 === match.goal) {
      user1.victories++;
      let achievement = null;
      if (user1.victories === 1) {
        achievement = await this.achievementsService.getAchievementByName("Must Be Luck");
      } else if (user1.victories === 10) {
        achievement = await this.achievementsService.getAchievementByName("Getting there");
      } else if (user1.victories === 100) {
        achievement = await this.achievementsService.getAchievementByName("Pro Gamer");
      }
      if (achievement) {
        user1.achievements.push(achievement);
      }
      user2.defeats++;
    } else {
      user2.victories++;
      let achievement = null;
      if (user2.victories === 1) {
        achievement = await this.achievementsService.getAchievementByName("Must Be Luck");
      } else if (user2.victories === 10) {
        achievement = await this.achievementsService.getAchievementByName("Getting there");
      } else if (user2.victories === 100) {
        achievement = await this.achievementsService.getAchievementByName("Pro Gamer");
      }
      if (achievement) {
        user2.achievements.push(achievement);
      }
      user1.defeats++;
    }
    const user1win = match.score_user1 === match.goal
    match.winner = user1win ? match.user1_id : match.user2_id;
    await this.matchesRepository.save(match);
    await this.usersRepository.save(user1);
    await this.usersRepository.save(user2);
    return match;
  }

  async updateMatch(id: number, updatedMatch: & Match) {
    //await this.getMatchById(id);
    if (updatedMatch.score_user1 === updatedMatch.goal || updatedMatch.score_user2 === updatedMatch.goal)
      return await this.weHaveAWinner(updatedMatch);
    else
      await this.matchesRepository.save(updatedMatch);
  }

  async deleteMatch(match_id: number) {
    let match = await this.getMatchById(match_id);
    match.users = [];
    await this.matchesRepository.save(match);
    await this.matchesRepository.delete(match_id);
    //Ne rien renvoyer si success ?
  }

}