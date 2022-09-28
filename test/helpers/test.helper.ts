import { TestingModule } from '@nestjs/testing';
import { AppDataSource } from '@src/config/datasource';
import { Connection, getConnection } from 'typeorm';

type JestType = typeof jest;

export class TestHelper {
  private moduleFixture: TestingModule;
  private jest: JestType;
  private connection: Connection;

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
}
