import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product } from './products.model';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<Product>,
  ) {}

  private products: Product[] = [];

  async insertProduct(
    title: string,
    description: string,
    price: number,
  ): Promise<string> {
    const newProduct = await this.productModel.create({
      title,
      description,
      price,
    });
    return newProduct._id as string;
  }

  async getProducts(): Promise<
    {
      id: string;
      title: string;
      description: string;
      price: number;
    }[]
  > {
    const products = await this.productModel.find().exec();
    return products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    }));
  }

  async getProductById(
    id: string,
  ): Promise<{
    id: string;
    title: string;
    description: string;
    price: number;
  }> {
    const product = await this.findProduct(id);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    id: string,
    title: string,
    description: string,
    price: number,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.findProduct(id);
      if (title) {
        updatedProduct.title = title;
      }
      if (description) {
        updatedProduct.description = description;
      }
      if (price) {
        updatedProduct.price = price;
      }
      return updatedProduct.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();

    if (result && result.n === 0) {
      throw new NotFoundException();
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
      return product;
    } catch (error) {
      if (!product) {
        throw new NotFoundException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
