import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { ProductSchema } from './products.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
