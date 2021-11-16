import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class MuteUserDto {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()   
    @IsNumber()
    timeInMilliseconds: bigint;
}