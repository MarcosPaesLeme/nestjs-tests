import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Product } from '../src/products/products.model';

describe('Tabletop-Companion e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await mongoose.connect(
      'mongodb://nest-poc:nest123@ds019658.mlab.com:19658/nestjs-poc',
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    await mongoose.connection.db.dropDatabase();
    app = moduleFixture.createNestApplication();
    await app.listen(3000);
  });

  afterAll(async done => {
    await mongoose.connection.db.dropDatabase();
    mongoose.disconnect(done);
  });

  it('should initialize the server', () => {
    expect(app).toBeTruthy();
  });

  describe('products', () => {
    it('should register a product', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          title: 'AAAA',
          description: 'BBB',
          price: 40,
        })
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(typeof body.id).toBe('string');
        });
    });
  });
});
