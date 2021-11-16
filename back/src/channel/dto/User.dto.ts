import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UserDto {
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number;
    
}