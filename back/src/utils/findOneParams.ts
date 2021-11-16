import { IsNumberString } from 'class-validator';
 
export default class FindOneParams {
  @IsNumberString()
  id: string;
}