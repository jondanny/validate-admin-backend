import { Injectable } from '@nestjs/common';
import { PagingResult } from 'typeorm-cursor-pagination';
import { CreateTicketProviderEncryptionKeyValidationDto } from './dto/create-ticket-provider-encryption-key.validation.dto';
import { TicketProviderEncryptionKeyFilterDto } from './dto/ticket-provider-encryption-key.filter.dto';
import { TicketProviderEncryptionKey } from './ticket-provider-encryption-key.entity';
import { TicketProviderEncryptionKeyRepository } from './ticket-provider-encryption-key.repository';
import { TicketProviderEncryptionService } from './ticket-provider-encryption.service';

@Injectable()
export class TicketProviderEncryptionKeyService {
  constructor(
    private readonly ticketProviderEncryptionKeyRepo: TicketProviderEncryptionKeyRepository,
    private readonly ticketProviderEncryptionService: TicketProviderEncryptionService,
  ) {}

  async findByVersion(version: number, ticketProviderId: number): Promise<TicketProviderEncryptionKey> {
    return this.ticketProviderEncryptionKeyRepo.findByVersion(version, ticketProviderId);
  }

  async create(
    createTicketProviderEncryptionKeyDto: CreateTicketProviderEncryptionKeyValidationDto,
  ): Promise<TicketProviderEncryptionKey> {
    console.log(createTicketProviderEncryptionKeyDto.ticketProviderId);
    const currentVersion = await this.ticketProviderEncryptionKeyRepo.getCurrentVersion(
      createTicketProviderEncryptionKeyDto.ticketProviderId,
    );
    const newVersion = Number(currentVersion?.version ?? 0) + 1;
    const entity: Partial<TicketProviderEncryptionKey> = {
      ticketProviderId: createTicketProviderEncryptionKeyDto.ticketProviderId,
      version: newVersion,
      secretKey: this.ticketProviderEncryptionService.generateSecretKey(),
    };

    const encryptionKey = await this.ticketProviderEncryptionKeyRepo.save(entity, { reload: false });

    return this.findByVersion(encryptionKey.version, createTicketProviderEncryptionKeyDto.ticketProviderId);
  }

  async findAllPaginated(
    searchParams: TicketProviderEncryptionKeyFilterDto,
  ): Promise<PagingResult<TicketProviderEncryptionKey>> {
    return this.ticketProviderEncryptionKeyRepo.getPaginatedQueryBuilder(searchParams);
  }
}
