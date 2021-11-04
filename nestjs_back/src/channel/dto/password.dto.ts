import { IsString, IsOptional} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class PasswordDto {
    
    @IsString()
    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    password: string; 
    
}