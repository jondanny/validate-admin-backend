import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserValidationDto } from './dto/create-user.validation.dto';
import { UpdateUserValidationDto } from './dto/update-user.validation.dto';
import { UserFilterDto } from './dto/user.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserData: CreateUserValidationDto) {
    const user = await this.userRepository.save(createUserData);

    return this.userRepository.findOne({ where: { id: user.id } });
  }

  async update(uuid: string, updateUserDto: UpdateUserValidationDto) {
    await this.userRepository.update({ uuid: uuid }, updateUserDto);

    return this.findByUuid(uuid);
  }

  async findAllPaginated(searchParams: UserFilterDto): Promise<PagingResult<User>> {
    return this.userRepository.getPaginatedQueryBuilder(searchParams);
  }

  async remove(uuid: string) {
    await this.userRepository.softDelete({ uuid });

    return;
  }

  async findByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  async isUserExist(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user !== null;
  }
}
