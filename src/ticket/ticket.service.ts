import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { Ticket } from './ticket.entity';
import { CreateTicketValidationDto } from './dto/create.ticket.validation.dto';
import { UpdateTicketValidationDto } from './dto/update.ticket.validation.dto';
import { TicketFilterDto } from './dto/ticket.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';
import { TicketStatus } from './ticket.types';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(createTicketDto: CreateTicketValidationDto) {
    const ticket = await this.ticketRepository.save(createTicketDto);

    return this.ticketRepository.findOne({ where: { id: ticket.id } });
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
}
