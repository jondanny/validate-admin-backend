import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEthereumAddress, IsInt, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserValidationDto {
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

  @ApiProperty({ example: '011-971-55-000-0000', required: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(255)
  phoneNumber: string;

  @ApiProperty({ example: '0xb794f5ea0ba39494ce839613fffba74279579268', required: true })
  @IsNotEmpty()
  @IsEthereumAddress()
  @MaxLength(255)
  walletAddress: string;

  @ApiProperty({ example: 2, required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  ticketProviderId: number;
}
