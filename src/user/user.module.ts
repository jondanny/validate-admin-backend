import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketProviderModule } from '@src/ticket-provider/ticket-provider.module';
import { TicketProviderValidator } from '@src/ticket-provider/ticket-provider.validator';
import { TicketProviderExistsValidator } from '@src/ticket-provider/validators/ticket-provider-exists.validator';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { ProducerModule } from '@src/producer/producer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TicketProviderModule, ProducerModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, TicketProviderValidator, TicketProviderExistsValidator],
  exports: [UserService],
})
export class UserModule {}
