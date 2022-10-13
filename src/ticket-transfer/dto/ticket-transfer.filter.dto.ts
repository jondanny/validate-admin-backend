import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsUUID } from 'class-validator';
import { CursorFilterDto } from '@src/common/pagination/cursor-filter.dto';
import { TicketTransfer } from '../ticket-transfer.entity';
import { Type } from 'class-transformer';

export class TicketTransferFilterDto extends CursorFilterDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ticketProviderId: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  uuid: string;

  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  orderParam: keyof TicketTransfer = 'createdAt';
}
