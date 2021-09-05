import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMatchDto {

	@IsNumber()
  public id: number;
  
  @IsNumber()
  public user1: number;

  @IsNumber()
  public user2: number;
  
  @IsNumber()
  public score_user1: number;

  @IsNumber()
  public score_user2: number;
  
  @IsNumber()
  public winner?: number;

}
   
export default UpdateMatchDto;