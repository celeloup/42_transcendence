import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class UpdateFriendsDto {
    @IsNumber()
    @IsNotEmpty()
	friends: number[];
}