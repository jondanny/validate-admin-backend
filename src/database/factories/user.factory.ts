import { faker } from '@faker-js/faker';
import { AppDataSource } from '@src/config/datasource';
import { User } from '@src/user/user.entity';

export class UserFactory {
  static async create(data?: Partial<User>) {
    const user = new User();
    user.name = faker.name.firstName();
    user.email = faker.internet.email();
    user.phoneNumber = faker.phone.number('+1907#######').toString();
    user.walletAddress = faker.finance.bitcoinAddress();
    user.ticketProviderId = Math.floor(Math.random() * 100);
    user.photoUrl = faker.internet.url();
    const userRepo = AppDataSource.manager.getRepository(User);

    return await userRepo.save({ ...data, ...user });
  }
}
