import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class AddFriendDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
	friendId: number;
}