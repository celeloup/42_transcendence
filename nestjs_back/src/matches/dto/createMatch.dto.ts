import { IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateMatchDto {
  @IsBoolean()
  @ApiProperty()
  friendly: boolean;
  
  @ApiProperty()
  @IsNumber()
  user1_id: number;
  
  @ApiProperty()
  @IsNumber()
  user2_id: number;
}
