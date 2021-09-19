import { IsNotEmpty, IsNumber } from 'class-validator';

export default class UserDto {
    
    @IsNumber()
    @IsNotEmpty()
    userId: number;
    
}