import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { UserFilterDto } from './dto/user.filter.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async getPaginatedQueryBuilder(searchParams: UserFilterDto): Promise<PagingResult<User>> {
    const queryBuilder = this.createQueryBuilder('user');

    if ('ticketProviderId' in searchParams) {
      queryBuilder.andWhere({ ticketProviderId: searchParams.ticketProviderId });
    }

    if ('searchText' in searchParams) {
      queryBuilder.andWhere([
        { name: Like(`%${searchParams.searchText}%`) },
        { email: Like(`%${searchParams.searchText}%`) },
      ]);
    }

    const paginator = buildPaginator({
      entity: User,
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
