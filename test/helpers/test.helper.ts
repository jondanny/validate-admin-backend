import { TestingModule } from '@nestjs/testing';
import { AppDataSource } from '@src/config/datasource';
import { Admin } from '@src/admin/admin.entity';
import { JwtService } from '@nestjs/jwt';

type JestType = typeof jest;

export class TestHelper {
  private moduleFixture: TestingModule;
  private jest: JestType;

  constructor(moduleFixture: TestingModule, jest: JestType) {
    this.moduleFixture = moduleFixture;
    this.jest = jest;
  }

  async truncateTable(tableName: string): Promise<void> {
    await AppDataSource.query(`TRUNCATE TABLE ${tableName}`);
  }

  async cleanDatabase(): Promise<void> {
    await Promise.all(
      AppDataSource.entityMetadatas
        .filter((entity) => entity.tableName !== 'base_entity')
        .map((entity) => AppDataSource.query(`TRUNCATE TABLE ${entity.tableName}`)),
    );
  }

  /**
   * After calling this method, all the endpoint calls will happen from the passed in user.
   * @param admin
   */
  setAuthenticatedAdmin(admin: Admin): string {
    const jwtService = this.moduleFixture.get<JwtService>(JwtService);
    const adminMock = {
      uuid: admin.uuid,
      email: admin.email,
      name: admin.name,
    };

    return jwtService.sign(adminMock);
  }
}
