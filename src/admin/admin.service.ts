import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async findByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } });
  }
}
