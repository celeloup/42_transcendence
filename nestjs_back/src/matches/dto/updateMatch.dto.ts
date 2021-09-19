import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchDto {
  @ApiProperty()
  @IsNumber()
  public score_user1: number;

  @ApiProperty()
  @IsNumber()
  public score_user2: number;
}
   
export default UpdateMatchDto;