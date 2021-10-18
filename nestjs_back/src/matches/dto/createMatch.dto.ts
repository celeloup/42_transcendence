import { IsNumber, IsBoolean} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateMatchDto {

  @ApiProperty()
  @IsBoolean()
  friendly: boolean;
  
  @ApiProperty()
  @IsNumber()
  user1_id: number;
  
  @ApiProperty()
  @IsNumber()
  user2_id: number;

  @ApiProperty()
  @IsNumber()
  map: number;

  @ApiProperty()
  @IsNumber()
  speed: number;

  @ApiProperty()
  @IsNumber()
  goal: number;

  @ApiProperty()
  @IsBoolean()
  boost_available: boolean;

}
