import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { Ticket } from './ticket.entity';
import { CreateTicketValidationDto } from './dto/create.ticket.validation.dto';
import { UpdateTicketValidationDto } from './dto/update.ticket.validation.dto';
import { TicketFilterDto } from './dto/ticket.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';
import { TicketStatus, TicketEventPattern } from './ticket.types';
import { UserService } from '@src/user/user.service';
import { TicketProviderService } from '@src/ticket-provider/ticket-provider.service';
import { User } from '@src/user/user.entity';
import { TicketProvider } from '@src/ticket-provider/ticket-provider.entity';
import { TicketMintMessage } from './messages/ticket-mint.message';
import { TicketProviderSecurityLevel } from '@src/ticket-provider/ticket-provider.types';
import { TicketProviderEncryptionKeyService } from '@src/ticket-provider-encryption-key/ticket-provider-encryption-key.service';
import { ProducerService } from '@src/producer/producer.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly userService: UserService,
    private readonly ticketProviderService: TicketProviderService,
    private readonly producerService: ProducerService,
    private readonly ticketProviderEncryptionKeyService: TicketProviderEncryptionKeyService,
  ) {}

  async create(createTicketDto: CreateTicketValidationDto) {
    const user = await this.userService.findById(createTicketDto.userId);
    const ticketProvier = await this.ticketProviderService.findById(createTicketDto.ticketProviderId);
    const ticket = await this.ticketRepository.save({ ...createTicketDto });
    const encryptedUserData = await this.getEncryptedUserData(user, ticketProvier);

    this.producerService.emit(
      TicketEventPattern.Mint,
      new TicketMintMessage({
        ticketUuid: ticket.uuid,
        userUuid: user.uuid,
        name: ticket.name,
        description: ticket.name,
        image: 'https://loremflickr.com/cache/resized/65535_51819602222_b063349f16_c_640_480_nofilter.jpg',
        ...encryptedUserData,
      }),
    );

    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketValidationDto) {
    await this.ticketRepository.update({ id }, updateTicketDto);

    return this.findById(id);
  }

  async findAllPaginated(searchParams: TicketFilterDto): Promise<PagingResult<Ticket>> {
    return this.ticketRepository.getPaginatedQueryBuilder(searchParams);
  }

  async delete(id: number) {
    await this.ticketRepository.update({ id }, { status: TicketStatus.Deleted, deletedAt: new Date() });

    return;
  }

  async findById(id: number): Promise<Ticket> {
    return this.ticketRepository.findOne({ where: { id } });
  }

  async isTicketExist(id: number): Promise<boolean> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    return ticket !== null;
  }

  private async getEncryptedUserData(
    user: User,
    ticketProvider: TicketProvider,
  ): Promise<Pick<TicketMintMessage, 'user'>> {
    if (ticketProvider.securityLevel !== TicketProviderSecurityLevel.Level2) {
      return;
    }

    return {
      user: await this.ticketProviderEncryptionKeyService.encryptTicketUserData(user),
    };
  }
}
