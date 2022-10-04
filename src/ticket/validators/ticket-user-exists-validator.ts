import { CreateTicketTransferDto } from '@src/ticket-transfer/dto/create-ticket-transfer.dto';
import { UserService } from '@src/user/user.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CreateTicketValidationDto } from '../dto/create.ticket.validation.dto';

@ValidatorConstraint({ name: 'ticketUserExistsValidator', async: true })
export class TicketUserExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(userId: number, args: ValidationArguments): Promise<boolean> {
    const { ticketProviderId } = args.object as CreateTicketValidationDto | CreateTicketTransferDto;
    const user = await this.userService.findByUserIdAndTicketProviderId(userId, ticketProviderId);

    return Boolean(user);
  }

  defaultMessage() {
    return 'User not found';
  }
}
