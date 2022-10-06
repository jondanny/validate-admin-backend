import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TicketTransferStatus } from './ticket-transfer.types';
import { TicketProvider } from '@src/ticket-provider/ticket-provider.entity';
import { User } from '@src/user/user.entity';
import { Ticket } from '@src/ticket/ticket.entity';

@Entity('ticket_transfer')
export class TicketTransfer {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: `Ticket transfer operation uuid`, maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @Column({ type: 'int', nullable: false })
  userIdFrom: number;

  @Column({ type: 'int', nullable: false })
  userIdTo: number;

  @Column({ type: 'int', nullable: false })
  ticketId: number;

  @Column({ type: 'int', nullable: false })
  ticketProviderId: number;

  @ApiProperty({ description: 'Created at date', required: true })
  @Column({ type: 'datetime', nullable: false })
  createdAt: Date;

  @ApiProperty({ description: 'Finished at date', required: false })
  @Column({ type: 'datetime', nullable: true })
  finishedAt: Date;

  @ApiProperty({ description: 'Ticket transfer status', example: TicketTransferStatus.InProgress, required: true })
  @Column({ type: 'enum', nullable: false, enum: TicketTransferStatus })
  status: TicketTransferStatus;

  @ManyToOne(() => TicketProvider, (ticketProvider) => ticketProvider.apiTokens)
  ticketProvider: TicketProvider;

  @ManyToOne(() => Ticket, (ticket) => ticket.transfers)
  ticket: Ticket;

  @OneToOne(() => User, (user) => user.ticketTransfersFrom)
  userFrom: User;

  @OneToOne(() => User, (user) => user.ticketTransfersTo)
  userTo: User;
}
