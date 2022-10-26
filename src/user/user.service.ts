import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserValidationDto } from './dto/create-user.validation.dto';
import { UpdateUserValidationDto } from './dto/update-user.validation.dto';
import { UserFilterDto } from './dto/user.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';
import { UserEventPattern } from './user.types';
import { ProducerService } from '@src/producer/producer.service';
import { WalletCreateMessage } from './messages/wallet-create.message';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly producerService: ProducerService) {}

  async create(createUserData: CreateUserValidationDto) {
    const user = await this.userRepository.save(createUserData);

    await this.producerService.emit(
      UserEventPattern.WalletCreate,
      new WalletCreateMessage({
        userUuid: user.uuid,
      }),
    );

    return this.userRepository.findOne({ where: { id: user.id } });
  }

  async update(id: number, updateUserDto: UpdateUserValidationDto) {
    await this.userRepository.update({ id: id }, updateUserDto);

    return this.findById(id);
  }

  async findAllPaginated(searchParams: UserFilterDto): Promise<PagingResult<User>> {
    return this.userRepository.getPaginatedQueryBuilder(searchParams);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  async findByUserIdAndTicketProviderId(userId: number, ticketProviderId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId, ticketProviderId } });
  }

  async isUserExist(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user !== null;
  }
}
