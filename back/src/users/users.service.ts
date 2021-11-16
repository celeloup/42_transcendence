import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import AchievementsService from '../achievements/achievements.service';
import Channel from 'src/channel/channel.entity';
import Match from 'src/matches/match.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private achievementsService: AchievementsService,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>
  ) { }

  async getByIdNoThrow(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
  }

  async getById(id: number): Promise<User> {
    const user = await this.getByIdNoThrow(id);
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getByName(name: string): Promise<User> {
    const user = await this.usersRepository.findOne({ name });
    if (user) {
      return user;
    }
    throw new HttpException('User with this name does not exist', HttpStatus.NOT_FOUND);
  }

  async getRankedUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({ order: { points: "DESC" }});
    if (users) {
      return users;
    }
    throw new HttpException('No user registered yet', HttpStatus.NOT_FOUND);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (users) {
      return users;
    }
    throw new HttpException('No user registered yet', HttpStatus.NOT_FOUND);
  }

  async getPrivateInfosById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(
      id,
      {
        relations: [
          'channels',
          'ownedChannels',
          'chan_admin',
          'blocked',
          'blockedBy'
        ],
        loadRelationIds: true
      }
    );
    //  const user = await this.usersRepository.findOne({id}, {loadRelationIds: true});
    if (user)
      return user;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async userIsInTheMatch(match: Match, user_id: number){
    var users = match.users
    if (!users || !users[0] || !users[1] || (users[0].id !== user_id && users[1].id !== user_id))
      return false;
    else
      return true;
  }

  async getMatchesByUserId(id: number) {
    var matches = await this.matchesRepository.find({
      order: { createdDate: "DESC" }, relations: ['users']
    });
    var matches2= [];
    if (matches)
      for (var match of matches)
        if ((await this.userIsInTheMatch(match, id)))
          await matches2.push(match);
    if (matches2)
      return matches2;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getChannelsByUserId(id: number): Promise<Channel[]> {
    const user = await this.usersRepository.findOne(id, { relations: ['channels', 'channels.members'] });
    if (user)
      return user.channels;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAchievementsByUserId(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['achievements'] });
    if (user)
      return user.achievements;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getFriendsByUserId(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['friends'] });
    if (user)
      return user.friends;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAllInfosByUserIdNoThrow(id: number) {
    return await this.usersRepository.findOne(
      id, {
      relations: [
        'achievements',
        'channels',
        'matches',
        'ownedChannels',
        'chan_admin',
        'chan_banned',
        'chan_muted',
        'friends',
        'friendOf',
        'blocked',
        'blockedBy']
    })
  }

  async getAllInfosByUserId(id: number) {
    const user = await this.getAllInfosByUserIdNoThrow(id);
    if (user)
      return user;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getBy42Id(id42: number): Promise<User> {
    return await this.usersRepository.findOne({ id42 });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    newUser.defeats = 0;
    newUser.victories = 0;
    newUser.points = 0;
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async nameAlreadyInUse(name: string) {
    const user = await this.usersRepository.findOne({ name });
    if (user)
      return true;
    return false;
  }

  async changeName(id: number, userData: UpdateUserDto): Promise<User> {
    if (userData.name.length < 3 || userData.name.length > 15)
      throw new HttpException('Name must be between 3 and 15 characters', HttpStatus.FORBIDDEN);
    if ((await this.nameAlreadyInUse(userData.name)))
      throw new HttpException('Name already in use', HttpStatus.FORBIDDEN);
    await this.usersRepository.update(id, userData);
    const updatedUser = await this.getById(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken(refreshToken: string, user_id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(user_id, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, user_id: number): Promise<User> {
    const user = await this.getById(user_id);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(user_id: number): Promise<UpdateResult> {
    return this.usersRepository.update(user_id, {
      currentHashedRefreshToken: null
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, user_id: number): Promise<UpdateResult> {
    return this.usersRepository.update(user_id, {
      twoFactorAuthenticationSecret: secret
    });
  }

  async turnOnTwoFactorAuthentication(user_id: number): Promise<UpdateResult> {
    return this.usersRepository.update(user_id, {
      isTwoFactorAuthenticationEnabled: true
    });
  }

  async turnOffTwoFactorAuthentication(user_id: number): Promise<UpdateResult> {
    return this.usersRepository.update(user_id, {
      isTwoFactorAuthenticationEnabled: false
    });
  }

  async isAFriend(user_id: number, friend_id: number) {
    const user = await this.getAllInfosByUserId(user_id);
    if (user) {
      const friend = await this.getById(friend_id)
      if (friend) {
        if ((user.friends && (user.friends.findIndex(element => element.id === friend_id))) !== -1)
          return true;
        return false;
      }
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async addAFriend(user_id: number, friend_id: number): Promise<User[]> {
    if (user_id !== friend_id) {
      if (!(await this.isAFriend(user_id, friend_id))) {
        if (!(await this.isBlocked(user_id, friend_id))) {
          if (!(await this.isBlocked(friend_id, user_id))) {
            let user = await this.getAllInfosByUserId(user_id);
            const friend = await this.getById(friend_id);
            user.friends.push(friend);
            let achievement = null;
            if (user.friends.length === 1) {
              achievement = await this.achievementsService.getAchievementByName("So Alone...");
            } else if (user.friends.length === 5) {
              achievement = await this.achievementsService.getAchievementByName("Not So Alone");
            } else if (user.friends.length === 10) {
              achievement = await this.achievementsService.getAchievementByName("Social Butterfly");
            }
            if (achievement) {
              user.achievements.push(achievement);
            }
            await this.usersRepository.save(user);
            return user.friends;
          }
          throw new HttpException('User blocked', HttpStatus.FORBIDDEN);
        }
        throw new HttpException('Friend blocked', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Users are already friends', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('Although your inner thoughts might be broad, you cannot be friend with yourself', HttpStatus.BAD_REQUEST);
  }

  async deleteAFriend(user_id: number, friend_id: number) {
    if ((await this.isAFriend(user_id, friend_id))) {
      const user = await this.getAllInfosByUserId(user_id);
      const friend = await this.getById(friend_id);
      let index = user.friends.indexOf(friend);
      user.friends.splice(index, 1);
      await this.usersRepository.save(user);
      return user.friends;
    }
    throw new HttpException('Users are not friends', HttpStatus.BAD_REQUEST);
  }

  async isBlocked(user_id: number, other_id: number) {
    const user = await this.getAllInfosByUserId(user_id);
    const other = await this.getById(other_id)
    if ((user.blocked && (user.blocked.findIndex(element => element.id === other_id))) !== -1)
      return true;
    return false;
  }

  async blockAUser(user_id: number, other_id: number): Promise<User[]> {
    if (user_id !== other_id) {
      if (!(await this.isBlocked(user_id, other_id))) {
        const user = await this.getAllInfosByUserId(user_id);
        const other = await this.getById(other_id);
        if ((await this.isAFriend(user_id, other_id)))
          await this.deleteAFriend(user_id, other_id);
        if ((await this.isAFriend(other_id, user_id)))
          await this.deleteAFriend(other_id, user_id);
        user.blocked.push(other);
        await this.usersRepository.save(user);
        return user.blocked;
      }
      throw new HttpException('User is already blocked', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('Although your inner thoughts might be unbearable, you cannot block yourself', HttpStatus.BAD_REQUEST);
  }

  async unblockAUser(user_id: number, other_id: number) {
    if ((await this.isBlocked(user_id, other_id))) {
      const user = await this.getAllInfosByUserId(user_id);
      const other = await this.getById(other_id);
      let index = user.blocked.indexOf(other);
      user.blocked.splice(index, 1);
      await this.usersRepository.save(user);
      return user.blocked;
    }
    throw new HttpException('User has not been blocked before', HttpStatus.BAD_REQUEST);
  }

  public async serveAvatar(user_id: number, res: any) {
    const avatar = (await this.getAllInfosByUserId(user_id)).avatar;
    if (avatar)
      return res.sendFile(avatar, { root: './' });
    throw new HttpException('No avatar set yet', HttpStatus.BAD_REQUEST);
  }

  public async setAvatar(user_id: number, avatarUrl: string) {
    const oldUrl = (await this.getById(user_id)).avatar;
    const fs = require('fs');
    if (oldUrl && oldUrl !== "")
      fs.unlink(oldUrl, (err: any) => {
        if (err) {
          throw new HttpException('Could not delete old avatar', HttpStatus.NOT_FOUND);
        }
      })
    return this.usersRepository.update(user_id, { avatar: avatarUrl });
  }

  public async appointModerator(user_id: number, newModeratorId: number) {
    const moderator = await this.getAllInfosByUserId(newModeratorId);
    const user = await this.getAllInfosByUserId(user_id);
    if (user.site_owner === true) {
      if (moderator.site_moderator === false && moderator.site_owner === false) {
        moderator.site_moderator = true;
        return await this.usersRepository.save(moderator);
      }
      throw new HttpException('This user is already a moderator or is a owner too', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Only the owner of the website can appoint moderators', HttpStatus.FORBIDDEN);
  }

  public async revokeModerator(user_id: number, newModeratorId: number) {
    const moderator = await this.getAllInfosByUserId(newModeratorId);
    const user = await this.getAllInfosByUserId(user_id);
    if (user.site_owner === true) {
      if (moderator.site_moderator === true && moderator.site_owner === false) {
        moderator.site_moderator = false;
        return await this.usersRepository.save(moderator);
      }
      throw new HttpException('This user is not a moderator or is a owner too', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Only the owner of the website can revoke moderators', HttpStatus.FORBIDDEN);
  }

  public async hasSiteRightsOverOtherUser(user_id: number, other_id: number) {
    if (await this.isSiteOwner(other_id))
      return false;
    if (await this.isSiteOwner(user_id))
      return true;
    if (await this.isSiteAdmin(other_id))
      return false;
    if (await this.isSiteAdmin(user_id))
      return true;
    return false;
  }

  public async isSiteOwner(user_id: number) {
    const user = await this.getAllInfosByUserId(user_id);
    if (user.site_owner === true) {
      return true;
    }
    return false;
  }

  public async isSiteAdmin(user_id: number) {
    const user = await this.getAllInfosByUserId(user_id);
    if (user.site_owner === true || user.site_moderator === true) {
      return true;
    }
    return false;
  }

  public async banUser(user_id: number, leper_id: number) {
    const user = await this.getAllInfosByUserId(user_id);
    const leper = await this.getAllInfosByUserId(leper_id);
    if ((await this.isSiteAdmin(user_id)) && !(leper.site_owner || (user.site_moderator && leper.site_moderator))) {
      leper.site_moderator = false;
      leper.site_banned = true;
      return await this.usersRepository.save(leper);
    }
    throw new HttpException('User does not have the rights to ban this member', HttpStatus.FORBIDDEN);
  }

  public async unbanUser(user_id: number, leper_id: number) {
    const user = await this.getAllInfosByUserId(user_id);
    const leper = await this.getAllInfosByUserId(leper_id);
    if ((await this.isSiteAdmin(user_id)) && !(leper.site_owner || (user.site_moderator && leper.site_moderator))) {
      leper.site_moderator = false;
      leper.site_banned = false;
      return await this.usersRepository.save(leper);
    }
    throw new HttpException('User does not have the rights to unban this member', HttpStatus.FORBIDDEN);
  }

  // Off topic
  // async deleteUser(user_id: number) {
  //   await this.getById(user_id);
  //   await this.usersRepository.delete(user_id);
  //   //Ne rien renvoyer si success ?
  // }
}