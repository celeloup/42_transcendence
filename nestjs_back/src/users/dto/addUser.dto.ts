import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class AddUserDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
	userId: number;
}