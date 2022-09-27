import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppBootstrapManager } from '@src/app-bootstrap.manager';
import { AppDataSource } from '@src/config/datasource';
import { TicketProviderFactory } from '@src/database/factories/ticket-provider.factory';

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

  it('Should post a ticket provider and return validation errors in response', async () => {
    const userData = {
      name: null,
      email: null,
    };
    await request(app.getHttpServer())
      .post('/api/v1/ticket-providers')
      .send(userData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'name must be shorter than or equal to 128 characters',
            'email must be shorter than or equal to 255 characters',
          ]),
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
  });

  it(`should post a ticket provider and get it back in response`, async () => {
    const userData = {
      name: 'Muaaz Tausif',
      email: 'muaaz@gmail.com',
    };

    await request(app.getHttpServer())
      .post('/api/v1/ticket-providers')
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

  it(`should get ticket provider by pagination`, async () => {
    const ticketProvider = await TicketProviderFactory.create();
    const ticketProvider2 = await TicketProviderFactory.create();
    await request(app.getHttpServer())
      .get(`/api/v1/ticket-providers?limit=1`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then(async (response) => {
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ...ticketProvider2,
            }),
          ]),
        );
        const afterCursor = response.body.cursor.afterCursor;
        await request(app.getHttpServer())
          .get(`/api/v1/ticket-providers?limit=1&afterCursor=${afterCursor}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer test`)
          .then((response) => {
            expect(response.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ...ticketProvider,
                }),
              ]),
            );
          });
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it('Should update a ticket provider and get updated data in response', async () => {
    const ticketProvider = await TicketProviderFactory.create();
    const updatedUser = {
      name: 'Muaaz Tausif',
      email: 'muaaz@gmail.com',
    };
    await request(app.getHttpServer())
      .patch(`/api/v1/ticket-providers/${ticketProvider.uuid}`)
      .send(updatedUser)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: ticketProvider.id,
            ...updatedUser,
          }),
        );
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it(`should get a ticket provider by id`, async () => {
    const ticketProvider = await TicketProviderFactory.create();
    await request(app.getHttpServer())
      .get(`/api/v1/ticket-providers/${ticketProvider.uuid}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            ...ticketProvider,
          }),
        );
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it(`should delete a ticket provider by id`, async () => {
    const user = await TicketProviderFactory.create();
    await request(app.getHttpServer())
      .delete(`/api/v1/ticket-providers/${user.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer test`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
      });
  });
});
