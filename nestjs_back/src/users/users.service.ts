import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import AddFriendDto from './dto/addFriend.dto';
import UpdateFriendsDto from './dto/updateFriends.dto';
import { json } from 'express';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  public async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getMatchesByUserId(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['matches'] });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // async getFriendsByUserId(id: number) {
  //   const user = await this.usersRepository.findOne(id, { relations: ['friends'] });
  //   if (user) {
  //     return user;
  //   }
  //   throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  // }

  async getBy42Id(id42: number) {
    const user = await this.usersRepository.findOne({ id42 });
    if (user) {
      return user;
    }
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    newUser.defeats = 0;
    newUser.victories = 0;
    newUser.points = 0;
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async changeName(id: number, userData: UpdateUserDto) {
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

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true
    });
  }

  async addAFriend(userId: number, friendData: AddFriendDto) {
    const user = await this.getById(userId);
    const friend = await this.getById(friendData.friendId);
    if (user && friend) {
      if (!user.friends)
        user.friends = new Array;
      if (!friend.friends)
        friend.friends = new Array;
      if (!(await user.friends.find(element => element === friend.name)))
      {
        user.friends.push(friend.name);
        friend.friends.push(user.name);
        await this.usersRepository.update(user.id, {friends: user.friends});
        await this.usersRepository.update(friend.id, {friends: friend.friends});
        return user;
      }
      throw new HttpException('Users are already friends', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}