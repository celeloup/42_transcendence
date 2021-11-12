import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Match from './match.entity';
import CreateMatchDto from './dto/createMatch.dto';
import UsersService from 'src/users/users.service';
import User from 'src/users/user.entity';
import AchievementsService from 'src/achievements/achievements.service';
import UpdateMatchDto from './dto/updateMatch.dto';

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

  async getMatchByIdNoThrow(id: number) {
    const match = await this.matchesRepository.findOne(id, {
      relations: ['users'], order: {
        createdDate: "DESC"
      }
    });
    if (match) {
      return match;
    }
  }

  async getMatchById(id: number) {
    const match = await this.getMatchByIdNoThrow(id)
    if (match) {
      return match;
    }
    throw new HttpException('Match with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async createMatch(matchData: CreateMatchDto) {
    const newMatch = await this.matchesRepository.create({
      ...matchData,
      users: [
        await this.usersService.getById(matchData.user1_id),
        await this.usersService.getById(matchData.user2_id)
      ]
    });
    await this.matchesRepository.save(newMatch);
    return newMatch;
  }

  //called from a websocket via updateMatch
  async weHaveAWinner(match: & Match) {
    const user1 = await this.usersService.getAllInfosByUserIdNoThrow(match.user1_id);
    const user2 = await this.usersService.getAllInfosByUserIdNoThrow(match.user2_id);
    if (!user1 || !user2)
      return ;
    user1.points += match.score_user1;
    user2.points += match.score_user2;
    if (match.score_user1 === match.goal || match.winner === user1.id) {
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
    const user1win = match.score_user1 === match.goal || match.winner === user1.id;
    match.winner = user1win ? match.user1_id : match.user2_id;
    await this.matchesRepository.save(match);
    await this.usersRepository.save(user1);
    await this.usersRepository.save(user2);
    return match;
  }

  // async updateMatchTest(id: number, updatedMatch: UpdateMatchDto) {
  //   //await this.getMatchById(id);
  //   if (updatedMatch.score_user1 === updatedMatch.goal || updatedMatch.score_user2 === updatedMatch.goal)
  //     return await this.weHaveAWinner(updatedMatch);
  //   return await this.matchesRepository.save(updatedMatch);
  // }

  async updateMatchUsers(match: &Match, user1_id: number, user2_id: number){
    if (match.user1_id !== user1_id){
      let user1 = await this.usersService.getByIdNoThrow(user1_id);
      match.users[0] = user1;
      match.user1_id = user1_id;
    }
    if (match.user2_id !== user2_id){
      let user2 = await this.usersService.getByIdNoThrow(user2_id);
      match.users[1] = user2;
      match.user2_id = user2_id;
    }
    await this.matchesRepository.save(match);
    return match;
  } 

  //called from a websocket
  async updateMatch(id: number, updatedMatch: & Match) {
    let originMatch = await this.getMatchByIdNoThrow(id);
    if (!originMatch)
      return ;
    if (originMatch.user1_id !== updatedMatch.user1_id || originMatch.user2_id !== updatedMatch.user2_id)
      originMatch = await this.updateMatchUsers(originMatch, updatedMatch.user1_id, updatedMatch.user2_id)
    originMatch.score_user1 = updatedMatch.score_user1;
    originMatch.score_user2 = updatedMatch.score_user2;
    originMatch.winner = updatedMatch.winner;
    console.log("updateMatch() originMatch.winner = ", originMatch.winner);
    if (updatedMatch.winner || updatedMatch.score_user1 === updatedMatch.goal || updatedMatch.score_user2 === updatedMatch.goal)
      return await this.weHaveAWinner(originMatch);
    return await this.matchesRepository.save(originMatch);
  }

  //called from a websocket
  async deleteMatch(match_id: number) {
    const match = await this.matchesRepository.findOne(match_id, {
      relations: ['users'], order: {
        createdDate: "DESC"
      }
    });
    if (!match)
      return ;
    match.users = [];
    await this.matchesRepository.save(match);
    await this.matchesRepository.delete(match_id);
    //Ne rien renvoyer si success ?
  }

}