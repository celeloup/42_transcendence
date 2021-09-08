import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import MatchesService from './matches.service';
import Match from './match.entity';
import MatchesController from './matches.controller';
import UsersModule from '../users/users.module'
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    UsersModule
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService]
})
export default class MatchesModule {}