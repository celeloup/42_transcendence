import { IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateMatchDto {  
  @IsBoolean()
  friendly: boolean;
  
  @IsNumber()
  user1_id: number;

  @IsNumber()
  user2_id: number;
  /* 
  @IsNumber()
  score_user1: number;

  @IsNumber()
  score_user2: number; */
}
export default CreateMatchDto;