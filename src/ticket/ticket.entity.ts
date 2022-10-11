import { ApiProperty } from '@nestjs/swagger';
import { TicketProvider } from '@src/ticket-provider/ticket-provider.entity';
import { TicketTransfer } from '@src/ticket-transfer/ticket-transfer.entity';
import { User } from '@src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TicketStatus } from './ticket.types';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Unique uid', maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @ApiProperty({ description: 'Name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  name: string;

  @ApiProperty({ description: 'Image url', maximum: 2048, required: false })
  @Column({ type: 'varchar', nullable: true, length: 2048 })
  imageUrl: string;

  @ApiProperty({ description: 'Additional data', required: false })
  @Column({ type: 'json', nullable: true })
  additionalData: string;

  @ApiProperty({ description: 'Contract id', maximum: 64, required: false })
  @Column({ type: 'varchar', nullable: true, length: 64 })
  contractId: string;

  @ApiProperty({ description: 'Ipfs uri', maximum: 2048, required: false })
  @Column({ type: 'varchar', nullable: true, length: 2048 })
  ipfsUri: string;

  @ApiProperty({ description: 'Token id', required: false })
  @Column({ type: 'int', nullable: true })
  tokenId: number;

  @ApiProperty({ description: 'Ticket Provider id', required: true })
  @Column({ type: 'int', nullable: false })
  ticketProviderId: number;

  @ApiProperty({ description: 'User id', required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Ticket status', enum: TicketStatus, required: true })
  @Column({ type: 'varchar', nullable: false, enum: TicketStatus })
  status: TicketStatus;

  @ApiProperty({ description: 'Date when the Ticket  was created', required: true })
  @Column({ type: 'datetime', nullable: false })
  createdAt: Date;

  @ApiProperty({ description: 'Date when Ticket was updated the last time', required: true })
  @Column({ type: 'datetime', nullable: false })
  updatedAt: Date;

  @ApiProperty({ description: 'Date when Ticket was deleted', required: true })
  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => TicketProvider, (ticketProvider) => ticketProvider.apiTokens)
  ticketProvider: TicketProvider;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @OneToMany(() => TicketTransfer, (ticketTransfer) => ticketTransfer.ticket)
  @JoinColumn({ name: 'id', referencedColumnName: 'ticket_id' })
  transfers: TicketTransfer[];
}
