import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { CursorFilterDto } from '@src/common/pagination/cursor-filter.dto';
import { User } from '../user.entity';
import { Type } from 'class-transformer';

export class UserFilterDto extends CursorFilterDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ticketProviderId: string;

  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  orderParam: keyof User = 'createdAt';
}
