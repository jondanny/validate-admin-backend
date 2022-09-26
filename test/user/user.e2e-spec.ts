import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppBootstrapManager } from '@src/app-bootstrap.manager';
import { UserFactory } from '@src/database/factories/user.factory';
import { AppDataSource } from '@src/config/datasource';

describe('User (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await AppBootstrapManager.getTestingModule();
    app = moduleFixture.createNestApplication();
    AppBootstrapManager.setAppDefaults(app);
    await AppDataSource.initialize();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should post a user and return validation errors in response', async () => {
    const userData = {
      name: null,
      email: null,
      phoneNumber: null,
      ticketProviderId: null,
    };
    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send(userData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'name must be shorter than or equal to 128 characters',
            'email must be shorter than or equal to 255 characters',
            'phoneNumber must be shorter than or equal to 255 characters',
            'ticketProviderId must be an integer number',
          ]),
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
  });

  it(`should post a user and get it back in response`, async () => {
    const userData = {
      name: 'My event 1',
      email: 'muaaz@gmail.com',
      phoneNumber: '+923214757374',
      ticketProviderId: 1,
    };

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send(userData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            ...userData,
          }),
        );
        expect(response.status).toBe(HttpStatus.CREATED);
      });
  });

  it(`should get users by pagination`, async () => {
    const user = await UserFactory.create();
    const user2 = await UserFactory.create();
    await request(app.getHttpServer())
      .get(`/api/v1/users?limit=1`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then(async (response) => {
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ...user2,
            }),
          ]),
        );
        const afterCursor = response.body.cursor.afterCursor;
        await request(app.getHttpServer())
          .get(`/api/v1/users?limit=1&afterCursor=${afterCursor}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer test`)
          .then((response) => {
            expect(response.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ...user,
                }),
              ]),
            );
          });
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it('Should update a ticket and get updated ticket in response', async () => {
    const user = await UserFactory.create();
    const updatedUser = {
      name: 'My event 1',
      email: 'muaaz@gmail.com',
      phoneNumber: '+923214757374',
    };
    await request(app.getHttpServer())
      .patch(`/api/v1/users/${user.uuid}`)
      .send(updatedUser)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: user.id,
            ...updatedUser,
          }),
        );
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it(`should get a user by id`, async () => {
    const user = await UserFactory.create();
    await request(app.getHttpServer())
      .get(`/api/v1/users/${user.uuid}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            ...user,
          }),
        );
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it(`should delete a user by id`, async () => {
    const user = await UserFactory.create();
    await request(app.getHttpServer())
      .delete(`/api/v1/users/${user.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
      });
  });
});
