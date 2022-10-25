import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketProviderEncryptionKeyModule } from '@src/ticket-provider-encryption-key/ticket-provider-encryption-key.module';
import { TicketProviderController } from './ticket-provider.controller';
import { TicketProvider } from './ticket-provider.entity';
import { TicketProviderRepository } from './ticket-provider.repository';
import { TicketProviderService } from './ticket-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketProvider]), TicketProviderEncryptionKeyModule],
  controllers: [TicketProviderController],
  providers: [TicketProviderService, TicketProviderRepository],
  exports: [TicketProviderService],
})
export class TicketProviderModule {}
