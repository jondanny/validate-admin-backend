import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketProviderStatus } from '../ticket-provider.types';

export class UpdateTicketProviderValidationDto {
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

  @ApiProperty({ example: TicketProviderStatus.Active, required: true })
  @IsOptional()
  @IsEnum(TicketProviderStatus)
  status: TicketProviderStatus;
}
