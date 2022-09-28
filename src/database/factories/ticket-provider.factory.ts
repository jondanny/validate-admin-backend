import { faker } from '@faker-js/faker';
import { AppDataSource } from '@src/config/datasource';
import { TicketProvider } from '@src/ticket-provider/ticket-provider.entity';

export class TicketProviderFactory {
  static async create(data?: Partial<TicketProvider>) {
    const ticketProvider = new TicketProvider();
    ticketProvider.name = faker.name.firstName();
    ticketProvider.email = faker.internet.email();
    const userRepo = AppDataSource.manager.getRepository(TicketProvider);

    return await userRepo.save({ ...data, ...ticketProvider });
  }
}
