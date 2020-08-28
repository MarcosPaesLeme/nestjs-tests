import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ): Promise<{ id: string }> {
    const productId = await this.productsService.insertProduct(
      prodTitle,
      prodDescription,
      prodPrice,
    );
    return { id: productId };
  }

  @Get()
  async getProducts(): Promise<any[]> {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  getProductById(@Param('id') id: string): any {
    return this.productsService.getProductById(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ): Promise<null> {
    await this.productsService.updateProduct(id, title, description, price);
    return null;
  }

  @Delete(':id')
  async deleteProductById(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.productsService.deleteProduct(id);
    return { message: `Product with id ${id}, deleted` };
  }
}
