import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { CursorFilterDto } from '@src/common/pagination/cursor-filter.dto';
import { TicketProvider } from '../ticket-provider.entity';
import { TicketProviderStatus } from '../ticket-provider.types';
import { Transform } from 'class-transformer';
import { ValidateHelper } from '@src/helpers/validate-helper';

export class TicketProviderFilterDto extends CursorFilterDto {
  @ApiProperty({ example: 'platinum', required: false })
  @Transform(({ value }) => ValidateHelper.sanitize(value))
  @IsOptional()
  @IsString()
  searchText: string;

  @ApiProperty({ example: TicketProviderStatus.Active, required: false })
  @IsOptional()
  @IsEnum(TicketProviderStatus)
  status: TicketProviderStatus;

  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  orderParam: keyof TicketProvider = 'createdAt';
}
