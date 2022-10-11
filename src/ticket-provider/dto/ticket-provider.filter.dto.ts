import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { CursorFilterDto } from '@src/common/pagination/cursor-filter.dto';
import { TicketProvider } from '../ticket-provider.entity';
import { TicketProviderStatus } from '../ticket-provider.types';

export class TicketProviderFilterDto extends CursorFilterDto {
  @ApiProperty({ example: 'platinum', required: true })
  @IsOptional()
  @IsString()
  searchText: string;

  @ApiProperty({ example: TicketProviderStatus.Active, required: true })
  @IsOptional()
  @IsEnum(TicketProviderStatus)
  status: TicketProviderStatus;

  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  orderParam: keyof TicketProvider = 'createdAt';
}
