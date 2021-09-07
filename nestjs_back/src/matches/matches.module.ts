import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import MatchesService from './matches.service';
import Match from './match.entity';
import MatchesController from './matches.controller';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService]
})
export default class MatchesModule {}