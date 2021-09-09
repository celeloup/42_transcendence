import { ApiProperty } from '@nestjs/swagger';

export default class AuthInfos {
  @ApiProperty()
	id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
	authentication: string;

  @ApiProperty()
  refresh: string;

  @ApiProperty()
  accessTokenExpiration: Date;

  @ApiProperty()
  refreshTokenExpiration: Date;
}