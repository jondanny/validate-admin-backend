import { AppDataSource } from '@src/config/datasource';
import { TicketTransfer } from '@src/ticket-transfer/ticket-transfer.entity';
import { faker } from '@faker-js/faker';

export class TicketTransferFactory {
  static async create(data?: Partial<TicketTransfer>) {
    const ticketTransferRepo = AppDataSource.manager.getRepository(TicketTransfer);

    return await ticketTransferRepo.save({ ...data });
  }
}
