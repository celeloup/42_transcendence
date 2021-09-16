import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class AddFriendDto {
    @IsNumber()
    @IsNotEmpty()
	friendId: number;
}