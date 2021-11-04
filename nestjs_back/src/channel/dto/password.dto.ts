import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class PasswordDto {
    
    @IsString()
    @ApiProperty()
    password: string;
    
}