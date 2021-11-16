import { ApiProperty } from '@nestjs/swagger';
import User from '../../users/user.entity';
import Channel from '../../channel/channel.entity';
import userInfos from '../../users/interface/userInfos.interface';

// Private infos of a user
export default class myUserInfos {
	@ApiProperty()
	id: number;

  @ApiProperty()
	name: string;

  @ApiProperty()
  admin: boolean;

  @ApiProperty()
  id42: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isTwoFactorAuthenticationEnabled: boolean;

  @ApiProperty({type: [Channel]})
  @ApiProperty()
  channels: Channel[];

  @ApiProperty({type: [Channel]})
  ownedChannels: Channel[];

  @ApiProperty({type: [Channel]})
  chan_admin: Channel[];

  @ApiProperty({type: [userInfos]})
  blocked: User[];

  @ApiProperty({type: [userInfos]})
  blockedBy: User[];
}