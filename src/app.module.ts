import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://nest-poc:nest123@ds019658.mlab.com:19658/nestjs-poc',
    ),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
