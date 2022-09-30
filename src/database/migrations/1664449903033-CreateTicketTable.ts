import { TicketStatus } from '@src/ticket/ticket.types';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTicketTable1664449903033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ticket',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            unsigned: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '128',
            isNullable: false,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
            length: '2048',
          },
          {
            name: 'additional_data',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'contract_id',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'token_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(TicketStatus),
            default: `'${TicketStatus.Active}'`,
          },
          {
            name: 'ticket_provider_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'ipfs_uri',
            type: 'varchar',
            length: '2048',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticket');
  }
}
