import { IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateMatchDto {
  @ApiProperty()
	@IsNumber()
  public id: number;
  
  @IsBoolean()
  friendly: boolean;
  
  @ApiProperty()
  @IsNumber()
  user1_id: number;
  
  @ApiProperty()
  @IsNumber()
  user2_id: number;

  /* 
  @IsNumber()
  @ApiProperty()
  score_user1: number;

  @IsNumber()
  @ApiProperty()
  score_user2: number; 
  
  @ApiPropertyOptional()
  @IsNumber()
  public winner?: number;
  
  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
  //password: string;
  */
}
