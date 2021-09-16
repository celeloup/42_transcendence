import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAchievementDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

}
export default CreateAchievementDto;