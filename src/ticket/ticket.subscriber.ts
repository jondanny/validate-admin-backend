import { EventSubscriber as EventSubscriberDecorator, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Ticket } from './ticket.entity';

@EventSubscriberDecorator()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
  listenTo(): any {
    return Ticket;
  }

  beforeInsert(ticket: InsertEvent<Ticket>): void {
    if (!ticket.entity.uuid) {
      ticket.entity.uuid = uuid();
    }
  }
}
