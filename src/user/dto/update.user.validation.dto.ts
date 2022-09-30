import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { UserStatus } from '../user.types';

export class UpdateUserValidationDto {
  @ApiProperty({ example: 'John Bucks', required: true })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty({ example: 'example@domain.com', required: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '011-971-55-000-0000', required: true })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(255)
  phoneNumber: string;

  @ApiProperty({ example: UserStatus.Active, required: true, default: UserStatus.Active })
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;
}