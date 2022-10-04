import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { TicketProviderApiTokenFilterDto } from './dto/ticket-provider-api-token.filter.dto';
import { TicketProviderApiToken } from './ticket-provider-api-token.entity';

@Injectable()
export class TicketProviderApiTokenRepository extends Repository<TicketProviderApiToken> {
  constructor(private readonly dataSource: DataSource) {
    super(TicketProviderApiToken, dataSource.manager);
  }

  async getPaginatedQueryBuilder(
    searchParams: TicketProviderApiTokenFilterDto,
  ): Promise<PagingResult<TicketProviderApiToken>> {
    const queryBuilder = this.createQueryBuilder('ticket_provider_api_token');

    const paginator = buildPaginator({
      entity: TicketProviderApiToken,
      alias: 'ticket_provider_api_token',
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
