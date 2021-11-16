import { ApiProperty } from '@nestjs/swagger';
import Achievement from '../../achievements/achievement.entity';
import Match from '../../matches/match.entity';
import User from '../user.entity';
import userInfos from './userInfos.interface';

// public infos of a user
export default class extendedUserInfos {
  @ApiProperty()
	id: number;

  @ApiProperty()
	name: string;

	@ApiProperty({type: [Match]})
  matches: Match[];

  @ApiProperty({type: [Achievement]})
  achievements: Achievement[];

  @ApiProperty()
  victories: number;

  @ApiProperty()
  defeats: number;

  @ApiProperty()
  points: number;

  @ApiProperty({type: [userInfos]})
  friends: User[];
}