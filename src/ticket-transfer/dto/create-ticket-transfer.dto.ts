import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { TicketUserExistsValidator } from '@src/ticket/validators/ticket-user-exists-validator';
import { Type } from 'class-transformer';
import { TicketProviderExistsValidator } from '@src/ticket-provider/validators/ticket-provider-exists.validator';
import { TicketExistsValidator } from '@src/ticket/validators/ticket-exists-validator';

export class CreateTicketTransferDto {
  @ApiProperty({
    example: '5e9d96f9-7103-4b8b-b3c6-c37608e38305',
    required: true,
    description: `New ticket owner uuid`,
  })
  @IsUUID()
  @Validate(TicketUserExistsValidator)
  userId: number;

  @ApiProperty({
    example: '5e9d96f9-7103-4b8b-b3c6-c37608e38305',
    required: true,
    description: `Ticket uuid`,
  })
  @IsInt()
  @Validate(TicketExistsValidator)
  ticketId: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Validate(TicketProviderExistsValidator)
  ticketProviderId: number;
}
