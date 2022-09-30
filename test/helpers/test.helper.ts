import { TestingModule } from '@nestjs/testing';
import { Admin } from '@src/admin/admin.entity';
import { JwtService } from '@nestjs/jwt';

type JestType = typeof jest;

export class TestHelper {
  private moduleFixture: TestingModule;
  private jest: JestType;

  constructor(moduleFixture: TestingModule, jest: JestType) {
    this.moduleFixture = moduleFixture;
    this.jest = jest;
  }

  /**
   * After calling this method, all the endpoint calls will happen from the passed in user.
   * @param admin
   */
  setAuthenticatedAdmin(admin: Admin): string {
    const jwtService = this.moduleFixture.get<JwtService>(JwtService);
    const adminMock = {
      uuid: admin.uuid,
      email: admin.email,
      name: admin.name,
    };

    return jwtService.sign(adminMock);
  }
}
