import { ApiProperty } from '@nestjs/swagger';
import { TicketProviderExistsValidator } from '@src/ticket-provider/validators/ticket-provider-exists.validator';
import { UserExistsValidator } from '@src/user/validators/user-exists.validator';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Validate } from 'class-validator';
import { TicketStatus } from '../ticket.types';

export class CreateTicketValidationDto {
  @ApiProperty({ example: 'John Bucks', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty({
    example: 'https://img.new.livestream.com/events/00000000004f5dbd/7ffdcd50-2e4b-497a-acca-bc33070c3e12.jpg',
    required: false,
    maxLength: 2048,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  imageUrl: string;

  @ApiProperty({
    example: '{ "id": 0 }',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  additionalData: string;

  @ApiProperty({
    example: 'abcdefghi',
    required: false,
    maxLength: 64,
  })
  @MaxLength(64)
  @IsOptional()
  @IsString()
  contractId: string;

  @ApiProperty({
    example: 'abcdefghi',
    required: false,
    maxLength: 2048,
  })
  @MaxLength(2048)
  @IsOptional()
  @IsUrl()
  ipfsUri: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  tokenId: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Validate(TicketProviderExistsValidator)
  ticketProviderId: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Validate(UserExistsValidator)
  userId: number;

  @ApiProperty({ example: TicketStatus.Active, required: true, default: TicketStatus.Active })
  @IsOptional()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
