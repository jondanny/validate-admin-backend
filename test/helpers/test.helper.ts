import { TestingModule } from '@nestjs/testing';
import { Connection, getConnection } from 'typeorm';

type JestType = typeof jest;

export class TestHelper {
  private moduleFixture: TestingModule;
  private jest: JestType;
  private connection: Connection;

  constructor(moduleFixture: TestingModule, jest: JestType) {
    this.moduleFixture = moduleFixture;
    this.jest = jest;
    this.connection = getConnection();
  }

  async truncateTable(tableName: string): Promise<void> {
    const connection = getConnection();

    await connection.query(`TRUNCATE TABLE ${tableName}`);
  }

  async cleanDatabase(): Promise<void> {
    await Promise.all(
      this.connection.entityMetadatas
        .filter((entity) => entity.tableName !== 'base_entity')
        .map((entity) => this.connection.query(`TRUNCATE TABLE ${entity.tableName}`)),
    );
  }
}
