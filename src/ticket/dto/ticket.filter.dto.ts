import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CursorFilterDto } from '@src/common/pagination/cursor-filter.dto';
import { Ticket } from '../ticket.entity';

export class TicketFilterDto extends CursorFilterDto {
  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  orderParam: keyof Ticket = 'createdAt';
}
