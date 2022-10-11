import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketProviderStatus } from '../ticket-provider.types';

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

  @ApiProperty({ example: TicketProviderStatus.Active, required: true, default: TicketProviderStatus.Active })
  @IsOptional()
  @IsEnum(TicketProviderStatus)
  status: TicketProviderStatus;
}
