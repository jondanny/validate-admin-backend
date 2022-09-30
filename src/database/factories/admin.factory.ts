import { faker } from '@faker-js/faker';
import { Admin } from '@src/admin/admin.entity';
import { AppDataSource } from '@src/config/datasource';

export class AdminFactory {
  static async create(data?: Partial<Admin>) {
    const admin = new Admin();
    admin.name = faker.name.firstName();
    admin.email = faker.internet.email();
    admin.password = 'test';
    const adminRepo = AppDataSource.manager.getRepository(Admin);

    return await adminRepo.save({ ...data, ...admin });
  }
}
