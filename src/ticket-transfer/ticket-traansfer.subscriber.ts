import { EventSubscriber as EventSubscriberDecorator, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TicketTransfer } from './ticket-transfer.entity';

@EventSubscriberDecorator()
export class TicketTransferSubscriber implements EntitySubscriberInterface<TicketTransfer> {
  listenTo(): any {
    return TicketTransfer;
  }

  beforeInsert(ticket: InsertEvent<TicketTransfer>): void {
    if (!ticket.entity.uuid) {
      ticket.entity.uuid = uuid();
    }
  }
}
