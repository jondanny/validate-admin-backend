import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { TicketProviderEncryptionKeyFilterDto } from './dto/ticket-provider-encryption-key.filter.dto';
import { TicketProviderEncryptionKey } from './ticket-provider-encryption-key.entity';

@Injectable()
export class TicketProviderEncryptionKeyRepository extends Repository<TicketProviderEncryptionKey> {
  constructor(private readonly dataSource: DataSource) {
    super(TicketProviderEncryptionKey, dataSource.manager);
  }

  async findByVersion(version: number, ticketProviderId: number): Promise<TicketProviderEncryptionKey> {
    return this.findOne({
      where: { version, ticketProviderId },
    });
  }

  async getCurrentVersion(ticketProviderId: number): Promise<TicketProviderEncryptionKey> {
    return this.findOne({
      where: { ticketProviderId },
      order: { version: 'DESC' },
    });
  }

  async getPaginatedQueryBuilder(
    searchParams: TicketProviderEncryptionKeyFilterDto,
  ): Promise<PagingResult<TicketProviderEncryptionKey>> {
    const queryBuilder = this.createQueryBuilder('ticket_provider_encryption_key').leftJoinAndMapOne(
      'ticket_provider_encryption_key.ticketProvider',
      'ticket_provider_encryption_key.ticketProvider',
      'ticket_provider',
    );

    if ('ticketProviderId' in searchParams) {
      queryBuilder.andWhere({ ticketProviderId: searchParams.ticketProviderId });
    }

    const paginator = buildPaginator({
      entity: TicketProviderEncryptionKey,
      alias: 'ticket_provider_encryption_key',
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
