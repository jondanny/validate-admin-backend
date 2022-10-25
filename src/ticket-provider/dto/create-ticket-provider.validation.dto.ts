import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketProviderSecurityLevel, TicketProviderStatus } from '../ticket-provider.types';

export class CreateTicketProviderValidationDto {
  @ApiProperty({ example: 'John Bucks', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty({ example: 'example@domain.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsEnum(TicketProviderSecurityLevel)
  securityLevel: TicketProviderSecurityLevel;

  @ApiProperty({ example: TicketProviderStatus.Active, required: true, default: TicketProviderStatus.Active })
  @IsOptional()
  @IsEnum(TicketProviderStatus)
  status: TicketProviderStatus;
}
