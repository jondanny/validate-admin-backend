import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTransfer } from './ticket-transfer.entity';
import { UserModule } from '@src/user/user.module';
import { TicketModule } from '@src/ticket/ticket.module';
import { TicketTransferService } from './ticket-transfer.service';
import { TicketTransferRepository } from './ticket-transfer-repository';
import { TicketTransferController } from './ticket-transfer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTransfer]), UserModule, TicketModule],
  providers: [TicketTransferService, TicketTransferRepository],
  controllers: [TicketTransferController],
  exports: [TicketTransferService],
})
export class TicketTransferModule {}
