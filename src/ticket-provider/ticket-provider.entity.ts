import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, Generated, DeleteDateColumn } from 'typeorm';
import { TicketProviderStatus } from './ticket-provider.types';

@Entity('ticket_provider')
export class TicketProvider {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Unique uid', maximum: 128 })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  @Generated('uuid')
  uuid: string;

  @ApiProperty({ description: 'Name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  name: string;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Ticket provider status', enum: TicketProviderStatus, required: false })
  @Column({ type: 'varchar', nullable: false, enum: TicketProviderStatus })
  status: TicketProviderStatus;

  @ApiProperty({ description: 'Date when the Ticket provider was created', required: true })
  @Column({ type: 'datetime', nullable: false })
  createdAt: Date;

  @ApiProperty({ description: 'Date when Ticket provider was updated the last time', required: true })
  @Column({ type: 'datetime', nullable: false })
  updatedAt: Date;

  @ApiProperty({ description: 'Date when Ticket provider was deleted', required: true })
  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt?: Date;
}
