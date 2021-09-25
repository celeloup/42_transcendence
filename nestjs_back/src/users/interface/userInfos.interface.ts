import { ApiProperty } from '@nestjs/swagger';

// infos expose by default for relations
export default class userInfos {
  @ApiProperty()
	id: number;

  @ApiProperty()
	name: string;
}