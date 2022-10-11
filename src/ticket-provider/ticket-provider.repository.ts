import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { TicketProviderFilterDto } from './dto/ticket-provider.filter.dto';
import { TicketProvider } from './ticket-provider.entity';

@Injectable()
export class TicketProviderRepository extends Repository<TicketProvider> {
  constructor(private readonly dataSource: DataSource) {
    super(TicketProvider, dataSource.manager);
  }

  async getPaginatedQueryBuilder(searchParams: TicketProviderFilterDto): Promise<PagingResult<TicketProvider>> {
    const queryBuilder = this.createQueryBuilder('ticket_provider');

    if ('status' in searchParams) {
      queryBuilder.andWhere({ status: searchParams.status });
    }

    if ('searchText' in searchParams) {
      queryBuilder.andWhere([
        { name: Like(`%${searchParams.searchText}%`) },
        { email: Like(`%${searchParams.searchText}%`) },
      ]);
    }

    const paginator = buildPaginator({
      entity: TicketProvider,
      alias: 'ticket_provider',
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
