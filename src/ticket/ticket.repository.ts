import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { TicketFilterDto } from './dto/ticket.filter.dto';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketRepository extends Repository<Ticket> {
  constructor(private readonly dataSource: DataSource) {
    super(Ticket, dataSource.manager);
  }

  async getPaginatedQueryBuilder(searchParams: TicketFilterDto): Promise<PagingResult<Ticket>> {
    const queryBuilder = this.createQueryBuilder('ticket');

    if ('ticketProviderId' in searchParams) {
      queryBuilder.andWhere({ ticketProviderId: searchParams.ticketProviderId });
    }

    if ('userId' in searchParams) {
      queryBuilder.andWhere({ userId: searchParams.userId });
    }

    if ('searchText' in searchParams) {
      queryBuilder.andWhere({ name: Like(`%${searchParams.searchText}%`) });
    }

    const paginator = buildPaginator({
      entity: Ticket,
      paginationKeys: ['id', searchParams.orderParam],
      query: {
        limit: searchParams.limit,
        order: searchParams.orderType,
        afterCursor: searchParams.afterCursor,
        beforeCursor: searchParams.beforeCursor,
      },
    });

    return paginator.paginate(queryBuilder);
  }
}
