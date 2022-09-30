import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserValidator {
  constructor(private readonly userService: UserService) {}

  async isUserValid(id: number): Promise<boolean> {
    return this.userService.isUserExist(id);
  }
}
