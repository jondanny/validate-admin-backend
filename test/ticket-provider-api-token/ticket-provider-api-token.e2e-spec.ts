import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppBootstrapManager } from '@src/app-bootstrap.manager';
import { AppDataSource } from '@src/config/datasource';
import { TicketProviderFactory } from '@src/database/factories/ticket-provider.factory';
import { AdminFactory } from '@src/database/factories/admin.factory';
import { TestHelper } from '@test/helpers/test.helper';
import { faker } from '@faker-js/faker';
import { TicketProviderApiTokenFactory } from '@src/database/factories/ticket-provider-api-token.factory';

describe('Ticket Provider Api Token (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let testHelper: TestHelper;

  beforeAll(async () => {
    moduleFixture = await AppBootstrapManager.getTestingModule();
    app = moduleFixture.createNestApplication();
    AppBootstrapManager.setAppDefaults(app);
    testHelper = new TestHelper(moduleFixture, jest);
    await AppDataSource.initialize();
    testHelper = new TestHelper(moduleFixture, jest);
    await app.init();
  });

  beforeEach(async () => {
    await testHelper.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Checks that endpoint throws unauthorized error', () => {
    request(app.getHttpServer()).get('/api/v1/ticket-provider-api-tokens').expect(HttpStatus.UNAUTHORIZED);
    request(app.getHttpServer()).get('/api/v1/ticket-provider-api-tokens/test').expect(HttpStatus.UNAUTHORIZED);
    request(app.getHttpServer()).post('/api/v1/ticket-provider-api-tokens').expect(HttpStatus.UNAUTHORIZED);
    request(app.getHttpServer()).patch('/api/v1/ticket-provider-api-tokens').expect(HttpStatus.UNAUTHORIZED);
    request(app.getHttpServer()).delete('/api/v1/ticket-provider-api-tokens').expect(HttpStatus.UNAUTHORIZED);
  });

  it('Should post a ticket provider api token and return validation errors in response', async () => {
    const admin = await AdminFactory.create();
    const token = testHelper.setAuthenticatedAdmin(admin);
    const ticketProviderApiTokenData = {};

    await request(app.getHttpServer())
      .post('/api/v1/ticket-provider-api-tokens')
      .send(ticketProviderApiTokenData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body.message).toEqual(
          expect.arrayContaining(['ticketProviderId must be an integer number', 'Ticket provider is not valid.']),
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
  });

  it(`should post a ticket provider api token and get it back in response`, async () => {
    const admin = await AdminFactory.create();
    const token = testHelper.setAuthenticatedAdmin(admin);

    const ticketProvider = await TicketProviderFactory.create();
    const ticketProviderData = {
      token: faker.lorem.words(3),
      ticketProviderId: ticketProvider.id,
    };

    await request(app.getHttpServer())
      .post('/api/v1/ticket-provider-api-tokens')
      .send(ticketProviderData)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            ...ticketProviderData,
          }),
        );
        expect(response.status).toBe(HttpStatus.CREATED);
      });
  });

  it(`should get ticket provider api token by pagination`, async () => {
    const admin = await AdminFactory.create();
    const token = testHelper.setAuthenticatedAdmin(admin);

    const ticketProvider = await TicketProviderFactory.create();
    const ticketProviderApiToken = await TicketProviderApiTokenFactory.create({ ticketProviderId: ticketProvider.id });
    const ticketProviderApiToken2 = await TicketProviderApiTokenFactory.create({ ticketProviderId: ticketProvider.id });

    await request(app.getHttpServer())
      .get(`/api/v1/ticket-provider-api-tokens?limit=1`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then(async (response) => {
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ...ticketProviderApiToken2,
            }),
          ]),
        );
        const afterCursor = response.body.cursor.afterCursor;
        await request(app.getHttpServer())
          .get(`/api/v1/ticket-provider-api-tokens?limit=1&afterCursor=${afterCursor}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ...ticketProviderApiToken,
                }),
              ]),
            );
          });
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it(`should get a ticket provider api token by id`, async () => {
    const admin = await AdminFactory.create();
    const token = testHelper.setAuthenticatedAdmin(admin);

    const ticketProvider = await TicketProviderFactory.create();
    const ticketProviderApiToken = await TicketProviderApiTokenFactory.create({ ticketProviderId: ticketProvider.id });

    await request(app.getHttpServer())
      .get(`/api/v1/ticket-provider-api-tokens/${ticketProviderApiToken.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            ...ticketProviderApiToken,
          }),
        );
        expect(response.status).toBe(HttpStatus.OK);
      });
  });

  it(`should delete a ticket provider by id`, async () => {
    const admin = await AdminFactory.create();
    const token = testHelper.setAuthenticatedAdmin(admin);

    const ticketProvider = await TicketProviderFactory.create();
    const ticketProviderApiToken = await TicketProviderApiTokenFactory.create({ ticketProviderId: ticketProvider.id });

    await request(app.getHttpServer())
      .delete(`/api/v1/ticket-provider-api-tokens/${ticketProviderApiToken.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(HttpStatus.OK);
      });
  });
});
