import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CursorFilterDto } from '@src/common/pagination/cursor-filter.dto';
import { User } from '../user.entity';

export class UserFilterDto extends CursorFilterDto {
  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt'])
  orderParam: keyof User = 'createdAt';
}
