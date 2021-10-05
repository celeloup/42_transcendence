import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import Achievement from '../achievements/achievement.entity';
import AchievementsService from '../achievements/achievements.service';
import Channel from 'src/channel/channel.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Achievement)
    private achievementsRepository: Repository<Achievement>,
    private achievementsService: AchievementsService
  ) { }

  async getById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    //  const user = await this.usersRepository.findOne({id}, {loadRelationIds: true});
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
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

  async getMatchesByUserId(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['matches'] });
    if (user)
      return user.matches;
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

  async getAllInfosByUserId(id: number) {
    const user = await this.usersRepository.findOne(
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
    if (user)
      return user;
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getBy42Id(id42: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id42 });
    if (user) {
      return user;
    }
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
    const user = this.usersRepository.findOne({ name });
    if (user)
      return true;
    return false;
  }

  async changeName(id: number, userData: UpdateUserDto): Promise<User> {
    if ((await this.nameAlreadyInUse(userData.name)))
      throw new HttpException('Name already in use', HttpStatus.FORBIDDEN);
    await this.usersRepository.update(id, userData);
    const updatedUser = await this.getById(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number): Promise<UpdateResult> {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<UpdateResult> {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret
    });
  }

  async turnOnTwoFactorAuthentication(userId: number): Promise<UpdateResult> {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true
    });
  }

  async isAFriend(userId: number, friendId: number) {
    const user = await this.getAllInfosByUserId(userId);
    if (user) {
      const friend = await this.getById(friendId)
      if (friend) {
        if ((user.friends && (user.friends.findIndex(element => element.id === friendId))) !== -1)
          return true;
        return false;
      }
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async addAFriend(userId: number, friendId: number): Promise<User[]> {
    if (userId !== friendId) {
      if (!(await this.isAFriend(userId, friendId))) {
        if (!(await this.isBlocked(userId, friendId))) {
          if (!(await this.isBlocked(friendId, userId))) {
            const user = await this.getAllInfosByUserId(userId);
            const friend = await this.getById(friendId);
            const firstFriend = await this.achievementsService.getAchievementById(1);
            if (user.friends.length === 0)
              user.achievements.push(firstFriend);
            user.friends.push(friend);
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

  async deleteAFriend(userId: number, friendId: number) {
    if ((await this.isAFriend(userId, friendId))) {
      const user = await this.getAllInfosByUserId(userId);
      const friend = await this.getById(friendId);
      let index = user.friends.indexOf(friend);
      user.friends.splice(index, 1);
      await this.usersRepository.save(user);
      return user.friends;
    }
    throw new HttpException('Users are not friends', HttpStatus.BAD_REQUEST);
  }

  async isBlocked(userId: number, otherId: number) {
    const user = await this.getAllInfosByUserId(userId);
    if (user) {
      const other = await this.getById(otherId)
      if (other) {
        if ((user.blocked && (user.blocked.findIndex(element => element.id === otherId))) !== -1)
          return true;
        return false;
      }
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async blockAUser(userId: number, otherId: number): Promise<User[]> {
    if (userId !== otherId) {
      if (!(await this.isBlocked(userId, otherId))) {
        const user = await this.getAllInfosByUserId(userId);
        const other = await this.getById(otherId);
        if ((await this.isAFriend(userId, otherId)))
          await this.deleteAFriend(userId, otherId);
        if ((await this.isAFriend(otherId, userId)))
          await this.deleteAFriend(otherId, userId);
        user.blocked.push(other);
        await this.usersRepository.save(user);
        return user.blocked;
      }
      throw new HttpException('User is already blocked', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('Although your inner thoughts might be unbearable, you cannot block yourself', HttpStatus.BAD_REQUEST);
  }

  async unblockAUser(userId: number, otherId: number) {
    if ((await this.isBlocked(userId, otherId))) {
      const user = await this.getAllInfosByUserId(userId);
      const other = await this.getById(otherId);
      let index = user.blocked.indexOf(other);
      user.blocked.splice(index, 1);
      await this.usersRepository.save(user);
      return user.blocked;
    }
    throw new HttpException('User has not been blocked before', HttpStatus.BAD_REQUEST);
  }

  public async serveAvatar(userId: number, res: any) {
    const avatar = (await this.getAllInfosByUserId(userId)).avatar;
    //  return avatar;
    if (avatar)
      return res.sendFile(avatar, { root: './' });
    throw new HttpException('No avatar set yet', HttpStatus.BAD_REQUEST);
  }

  public async setAvatar(userId: number, avatarUrl: string) {
    const oldUrl = (await this.getById(userId)).avatar;
    const fs = require('fs');
    if (oldUrl && oldUrl !== "")
      fs.unlink(oldUrl, (err: any) => {
        if (err) {
          throw new HttpException('Could not delete old avatar', HttpStatus.NOT_FOUND);
        }
      })
    return this.usersRepository.update(userId, { avatar: avatarUrl });
  }

  public async appointModerator(userId: number, newModeratorId: number) {
    const moderator = await this.getAllInfosByUserId(newModeratorId);
    const user = await this.getAllInfosByUserId(userId);
    if (user.site_owner === true) {
      if (moderator.site_moderator === false && moderator.site_owner === false) {
        moderator.site_moderator = true;
        return await this.usersRepository.save(moderator);
      }
      throw new HttpException('This user is already a moderator or is a owner too', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Only the owner of the website can appoint moderators', HttpStatus.FORBIDDEN);
  }

  public async revokeModerator(userId: number, newModeratorId: number) {
    const moderator = await this.getAllInfosByUserId(newModeratorId);
    const user = await this.getAllInfosByUserId(userId);
    if (user.site_owner === true) {
      if (moderator.site_moderator === true && moderator.site_owner === false) {
        moderator.site_moderator = false;
        return await this.usersRepository.save(moderator);
      }
      throw new HttpException('This user is not a moderator or is a owner too', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Only the owner of the website can revoke moderators', HttpStatus.FORBIDDEN);
  }

  public async isSiteAdmin(userId: number){
    const user = await this.getAllInfosByUserId(userId);
    if (user.site_owner === true || user.site_moderator === true){
      return true;
    }
    return false; 
  }

  public async banUser(userId: number, leperId: number){
    const user = await this.getAllInfosByUserId(userId);
    const leper = await this.getAllInfosByUserId(leperId);
    if ((await this.isSiteAdmin(userId)) && !(leper.site_owner || (user.site_moderator && leper.site_moderator))){
      leper.site_moderator = false;
      leper.site_banned = true;
      return await this.usersRepository.save(leper);
    }
    throw new HttpException('User does not have the rights to ban this member', HttpStatus.FORBIDDEN);
  }
  
  // Off topic
  // async deleteUser(user_id: number) {
  //   await this.getById(user_id);
  //   await this.usersRepository.delete(user_id);
  //   //Ne rien renvoyer si success ?
  // }
}