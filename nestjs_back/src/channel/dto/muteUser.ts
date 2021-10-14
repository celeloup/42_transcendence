import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class MuteUser {
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    timeInMilliseconds: number;
}