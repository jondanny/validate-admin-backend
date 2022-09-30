import { faker } from '@faker-js/faker';
import { AppDataSource } from '@src/config/datasource';
import { Ticket } from '@src/ticket/ticket.entity';

export class TicketFactory {
  static async create(data?: Partial<Ticket>) {
    const ticket = new Ticket();
    ticket.name = faker.name.firstName();
    ticket.contractId = faker.lorem.words(5);
    ticket.ipfsUri = faker.internet.url();
    ticket.imageUrl = faker.internet.url();
    ticket.tokenId = Math.floor(Math.random() * 100);
    ticket.additionalData = JSON.stringify({ id: 0 });
    const ticketRepo = AppDataSource.manager.getRepository(Ticket);

    return await ticketRepo.save({ ...data, ...ticket });
  }
}
