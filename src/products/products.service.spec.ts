import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductSchema, Product } from './products.model';
import { ProductsModule } from './products.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const mockProduct: (
  id?: string,
  title?: string,
  description?: string,
  price?: number,
) => any = (
  id = 'b205ac4d-fd96-4b1e-892a-d4fab818ea2a',
  title = 'Russian Blue',
  description = 'Ventus',
  price = 4,
) => {
  return {
    id,
    title,
    description,
    price,
  };
};

// still lazy, but this time using an object instead of multiple parameters
const mockProductDoc: (mock?: {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
}) => Partial<Product> = (mock?: {
  id: string;
  title: string;
  description: string;
  price: number;
}) => {
  return {
    _id: (mock && mock.id) || 'a uuid',
    title: (mock && mock.title) || 'Ventus',
    breed: (mock && mock.description) || 'Russian Blue',
    age: (mock && mock.price) || 4,
  };
};

const productArray: Product[] = [
  mockProduct(),
  mockProduct('fr05ac4d-fd96-4b1e-892a-d4fab818ea2e', 'Agasalho', 'Roupa', 29),
  mockProduct('b205ac4d-fd96-4b1e-892a-d4fab818ea45', 'Camisa', 'Roupa', 54),
];

const productDocArray = [
  mockProductDoc(),
  mockProductDoc({
    id: 'fr05ac4d-fd96-4b1e-892a-d4fab818ea2e',
    title: 'Agasalho',
    description: 'Roupa',
    price: 29,
  }),
  mockProductDoc({
    id: 'b205ac4d-fd96-4b1e-892a-d4fab818ea45',
    title: 'Camisa',
    description: 'Roupa',
    price: 54,
  }),
];

describe('ProductsService', () => {
  // let service: ProductsServiceMock;
  let service: ProductsService;
  let model: Model<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Products'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockProduct()),
            constructor: jest.fn().mockResolvedValue(mockProduct()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<Product>>(getModelToken('Products'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new product', async () => {
    const prodTitle = 'Fone de ouvido';
    const prodDescription = 'Acessorio';
    const prodPrice = 100;

    jest.spyOn(model, 'create').mockResolvedValueOnce({
      _id: 'b205ac4d-fd96-4b1e-892a-d4fab818ea2a',
      title: 'Russian Blue',
      description: 'Ventus',
      price: 4,
    } as any); // dreaded as any, but it can't be helped

    const newProduct = await service.insertProduct(
      prodTitle,
      prodDescription,
      prodPrice,
    );

    expect(newProduct).toEqual('b205ac4d-fd96-4b1e-892a-d4fab818ea2a');

    expect(typeof newProduct === 'string').toBe(true);
  });

  it('should return all products', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(productDocArray),
    } as any);

    const products = await service.getProducts();

    expect(products.length).toEqual(productArray.length);
  });
});
