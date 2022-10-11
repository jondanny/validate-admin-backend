import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketTransfer } from './ticket-transfer.entity';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { TicketTransferFilterDto } from './dto/ticket-transfer.filter.dto';

@Injectable()
export class TicketTransferRepository extends Repository<TicketTransfer> {
  constructor(private readonly dataSource: DataSource) {
    super(TicketTransfer, dataSource.manager);
  }

  async getPaginatedQueryBuilder(searchParams: TicketTransferFilterDto): Promise<PagingResult<TicketTransfer>> {
    const queryBuilder = this.createQueryBuilder('ticket_transfer');

    if ('uuid' in searchParams) {
      queryBuilder.andWhere({ uuid: searchParams.uuid });
    }

    const paginator = buildPaginator({
      entity: TicketTransfer,
      alias: 'ticket_transfer',
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
