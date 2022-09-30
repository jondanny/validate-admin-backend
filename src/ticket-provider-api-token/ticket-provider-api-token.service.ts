import { Injectable } from '@nestjs/common';
import { PagingResult } from 'typeorm-cursor-pagination';
import { CreateTicketProviderApiTokenValidationDto } from './dto/create-ticket-provider-api-token.validation.dto';
import { TicketProviderApiTokenFilterDto } from './dto/ticket-provider-api-token.filter.dto';
import { UpdateTicketProviderApiTokenValidationDto } from './dto/update-ticket-provider-api-token.validation.dto';
import { TicketProviderApiToken } from './ticket-provider-api-token.entity';
import { TicketProviderApiTokenRepository } from './ticket-provider-api-token.repository';

@Injectable()
export class TicketProviderApiTokenService {
  constructor(private readonly ticketProviderApiTokenRepository: TicketProviderApiTokenRepository) {}
  async create(ticketProviderApiTokenCreateValidationDto: CreateTicketProviderApiTokenValidationDto) {
    const ticketProviderApiToken = await this.ticketProviderApiTokenRepository.save(
      ticketProviderApiTokenCreateValidationDto,
    );

    return this.ticketProviderApiTokenRepository.findOne({ where: { id: ticketProviderApiToken.id } });
  }

  async update(id: number, updateTicketApiTokenDto: UpdateTicketProviderApiTokenValidationDto) {
    await this.ticketProviderApiTokenRepository.update({ id }, updateTicketApiTokenDto);

    return this.findById(id);
  }

  async findAllPaginated(searchParams: TicketProviderApiTokenFilterDto): Promise<PagingResult<TicketProviderApiToken>> {
    return this.ticketProviderApiTokenRepository.getPaginatedQueryBuilder(searchParams);
  }

  async remove(id: number) {
    await this.ticketProviderApiTokenRepository.softDelete({ id });

    return;
  }

  async findById(id: number): Promise<TicketProviderApiToken> {
    return this.ticketProviderApiTokenRepository.findOne({ where: { id } });
  }
}
