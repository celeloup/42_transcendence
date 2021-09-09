import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMatchDto {

  @IsNumber()
  public score_user1: number;

  @IsNumber()
  public score_user2: number;

}
   
export default UpdateMatchDto;