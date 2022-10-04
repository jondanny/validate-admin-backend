import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { Ticket } from './ticket.entity';
import { CreateTicketValidationDto } from './dto/create.ticket.validation.dto';
import { UpdateTicketValidationDto } from './dto/update.ticket.validation.dto';
import { TicketFilterDto } from './dto/ticket.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(createTicketDto: CreateTicketValidationDto) {
    const ticket = await this.ticketRepository.save(createTicketDto);

    return this.ticketRepository.findOne({ where: { id: ticket.id } });
  }

  async update(uuid: string, updateTicketDto: UpdateTicketValidationDto) {
    await this.ticketRepository.update({ uuid }, updateTicketDto);

    return this.findByUuid(uuid);
  }

  async findAllPaginated(searchParams: TicketFilterDto): Promise<PagingResult<Ticket>> {
    return this.ticketRepository.getPaginatedQueryBuilder(searchParams);
  }

  async remove(uuid: string) {
    await this.ticketRepository.softDelete({ uuid });

    return;
  }

  async findByUuid(uuid: string): Promise<Ticket> {
    return this.ticketRepository.findOne({ where: { uuid } });
  }

  async findById(id: number): Promise<Ticket> {
    return this.ticketRepository.findOne({ where: { id } });
  }

  async isTicketExist(id: number): Promise<boolean> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    return ticket !== null;
  }
}
