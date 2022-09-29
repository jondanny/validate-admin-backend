import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Admin } from '@src/admin/admin.entity';
import { AdminService } from '@src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(private adminService: AdminService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<Partial<Admin> | null> {
    const admin = await this.adminService.findByEmail(email);
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      return { name: admin.name, email: admin.email, uuid: admin.uuid };
    }

    return null;
  }

  async login(admin: Partial<Admin>) {
    const payload = { name: admin.name, email: admin.email, uuid: admin.uuid };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
