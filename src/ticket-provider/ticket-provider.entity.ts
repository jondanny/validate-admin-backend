import { ApiProperty } from '@nestjs/swagger';
import { TicketProviderApiToken } from '@src/ticket-provider-api-token/ticket-provider-api-token.entity';
import { Ticket } from '@src/ticket/ticket.entity';
import { User } from '@src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import {
  TicketProviderSecurityLevel,
  TicketProviderStatus,
  TicketProviderUserIdentifier,
} from './ticket-provider.types';

@Entity('ticket_provider')
export class TicketProvider {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Unique uid', maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @ApiProperty({ description: 'Name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  name: string;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Ticket provider status', enum: TicketProviderStatus, required: true })
  @Column({ type: 'varchar', nullable: false, enum: TicketProviderStatus })
  status: TicketProviderStatus;

  @ApiProperty({ description: 'Date when the Ticket provider was created', required: true })
  @Column({ type: 'datetime', nullable: false })
  createdAt: Date;

  @ApiProperty({ description: 'Date when Ticket provider was updated the last time', required: true })
  @Column({ type: 'datetime', nullable: false })
  updatedAt: Date;

  @ApiProperty({
    description: `Ticket provider's user unique identifier`,
    example: TicketProviderUserIdentifier.PhoneNumber,
    required: true,
  })
  @Column({ type: 'enum', nullable: false, enum: TicketProviderUserIdentifier })
  userIdentifier: TicketProviderUserIdentifier;

  @Column({ type: 'tinyint', default: 1 })
  securityLevel: TicketProviderSecurityLevel;

  @OneToMany(() => TicketProviderApiToken, (ticketProviderApiToken) => ticketProviderApiToken.ticketProvider)
  @JoinColumn({ name: 'id', referencedColumnName: 'ticket_provider_id' })
  apiTokens: TicketProviderApiToken[];

  @OneToMany(() => Ticket, (ticket) => ticket.ticketProvider)
  @JoinColumn({ name: 'id', referencedColumnName: 'ticket_provider_id' })
  tickets: Ticket[];

  @OneToMany(() => User, (user) => user.ticketProvider)
  @JoinColumn({ name: 'id', referencedColumnName: 'ticket_provider_id' })
  users: User[];
}
