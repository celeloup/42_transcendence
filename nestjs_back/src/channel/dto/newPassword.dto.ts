import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class NewPasswordDto {
    
    @IsString()
    @ApiProperty()
    password: string;
    
}