import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketProviderModule } from '@src/ticket-provider/ticket-provider.module';
import { TicketProviderValidator } from '@src/ticket-provider/ticket-provider.validator';
import { TicketProviderExistsValidator } from '@src/ticket-provider/validators/ticket-provider-exists.validator';
import { TicketProviderApiTokenApiTokenController } from './ticket-provider-api-token.controller';
import { TicketProviderApiToken } from './ticket-provider-api-token.entity';
import { TicketProviderApiTokenRepository } from './ticket-provider-api-token.repository';
import { TicketProviderApiTokenService } from './ticket-provider-api-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketProviderApiToken]), TicketProviderModule],
  controllers: [TicketProviderApiTokenApiTokenController],
  providers: [
    TicketProviderApiTokenService,
    TicketProviderApiTokenRepository,
    TicketProviderValidator,
    TicketProviderExistsValidator,
  ],
  exports: [TicketProviderApiTokenService],
})
export class TicketProviderApiTokenModule {}
