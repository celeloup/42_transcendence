import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import AddFriendDto from './dto/addFriend.dto';
import Achievement from '../achievements/achievement.entity';
import AchievementsService from '../achievements/achievements.service';

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

  async getMatchesByUserId(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['matches'] });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAchievementsByUserId(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['achievements'] });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getBy42Id(id42: number): Promise<User>  {
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

  async changeName(id: number, userData: UpdateUserDto): Promise<User> {
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

  async addAFriend(userId: number, friendData: AddFriendDto) {
    const user = await this.getAchievementsByUserId(userId);
    const friend = await this.getAchievementsByUserId(friendData.friendId);
    if (user && friend) {
      const firstFriend = await this.achievementsService.getAchievementById(1);
      if (!user.friends){
        user.friends = new Array;
      }
      if (!friend.friends){
        friend.friends = new Array;
      }
      if (user.friends.length === 0)
      {
        if (!user.achievements)
          user.achievements = new Array;
        user.achievements.push(firstFriend);
        await this.usersRepository.save(user);
      }
      if (friend.friends.length === 0)
      {
        if (!friend.achievements)
          friend.achievements = new Array;
        friend.achievements.push(firstFriend);
        await this.usersRepository.save(friend);
      }
      if (!(await user.friends.find(element => element === friend.id))) {
        user.friends.push(friend.id);
        friend.friends.push(user.id);
        await this.usersRepository.update(user.id, { friends: user.friends });
        await this.usersRepository.update(friend.id, { friends: friend.friends });
        return user;
      }
      throw new HttpException('Users are already friends', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async deleteAFriend(userId: number, friendData: AddFriendDto) {
    const user = await this.getById(userId);
    const friend = await this.getById(friendData.friendId);
    if (user && friend && user.friends && friend.friends) {
      if ((await user.friends.find(element => element === friend.id))) {
        let index = user.friends.indexOf(friend.id);
        user.friends.splice(index, 1);
        index = friend.friends.indexOf(user.id);
        friend.friends.splice(index, 1);
        await this.usersRepository.update(user.id, { friends: user.friends });
        await this.usersRepository.update(friend.id, { friends: friend.friends });
        return user;
      }
      throw new HttpException('Users are not friends', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}