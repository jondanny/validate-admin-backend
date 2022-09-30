import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketProviderModule } from '@src/ticket-provider/ticket-provider.module';
import { TicketProviderValidator } from '@src/ticket-provider/ticket-provider.validator';
import { TicketProviderExistsValidator } from '@src/ticket-provider/validators/ticket-provider-exists.validator';
import { UserModule } from '@src/user/user.module';
import { UserValidator } from '@src/user/user.validator';
import { UserExistsValidator } from '@src/user/validators/user-exists.validator';
import { TicketController } from './ticket.controller';
import { Ticket } from './ticket.entity';
import { TicketRepository } from './ticket.repository';
import { TicketService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), UserModule, TicketProviderModule],
  controllers: [TicketController],
  providers: [
    TicketService,
    TicketRepository,
    UserValidator,
    UserExistsValidator,
    TicketProviderValidator,
    TicketProviderExistsValidator,
  ],
  exports: [TicketService],
})
export class TicketModule {}
