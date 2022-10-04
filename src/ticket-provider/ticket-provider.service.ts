import { Injectable } from '@nestjs/common';
import { TicketProviderRepository } from './ticket-provider.repository';
import { TicketProvider } from './ticket-provider.entity';
import { CreateTicketProviderValidationDto } from './dto/create-ticket-provider.validation.dto';
import { UpdateTicketProviderValidationDto } from './dto/update-ticket-provider.validation.dto';
import { TicketProviderFilterDto } from './dto/ticket-provider.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';

@Injectable()
export class TicketProviderService {
  constructor(private readonly ticketProviderRepository: TicketProviderRepository) {}

  async create(createTicketProviderDto: CreateTicketProviderValidationDto) {
    const ticketProvider = await this.ticketProviderRepository.save(createTicketProviderDto);

    return this.ticketProviderRepository.findOne({ where: { id: ticketProvider.id } });
  }

  async update(uuid: string, updateTicketProviderDto: UpdateTicketProviderValidationDto) {
    await this.ticketProviderRepository.update({ uuid }, updateTicketProviderDto);

    return this.findByUuid(uuid);
  }

  async findAllPaginated(searchParams: TicketProviderFilterDto): Promise<PagingResult<TicketProvider>> {
    return this.ticketProviderRepository.getPaginatedQueryBuilder(searchParams);
  }

  async remove(uuid: string) {
    await this.ticketProviderRepository.softDelete({ uuid });

    return;
  }

  async findByUuid(uuid: string): Promise<TicketProvider> {
    return this.ticketProviderRepository.findOne({ where: { uuid } });
  }

  async isTicketProviderExist(id: number): Promise<boolean> {
    const ticketProvider = await this.ticketProviderRepository.findOne({ where: { id } });

    return ticketProvider !== null;
  }
}
