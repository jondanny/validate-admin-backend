import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTicketProviderApiTokenValidationDto {
  @ApiProperty({ example: 'abcs67ur#n(9885j3S', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  token: string;
}
