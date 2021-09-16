import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMatchDto {
/* 
  @ApiProperty()
	@IsNumber()
  public id: number;
  
  @ApiProperty()
  @IsNumber()
  public user1: number;

  @ApiProperty()
  @IsNumber()
  public user2: number; */
  
  @ApiProperty()
  @IsNumber()
  public score_user1: number;

  @ApiProperty()
  @IsNumber()
  public score_user2: number;
/*   
  @ApiPropertyOptional()
  @IsNumber()
  public winner?: number;
 */
}
   
export default UpdateMatchDto;