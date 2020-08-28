import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let spyService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useFactory: () => ({
            getProducts: jest.fn(() => true),
            insertProduct: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    spyService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return products', async () => {
      controller.getProducts();
      expect(spyService.getProducts).toHaveBeenCalled();
    });
  });

  describe('addProduct', () => {
    it('should insert a new product', async () => {
      const prodTitle = 'Fone de ouvido';
      const prodDescription = 'Acessorio';
      const prodPrice = 100;

      controller.addProduct(prodTitle, prodDescription, prodPrice);
      expect(spyService.insertProduct).toHaveBeenCalledWith(
        prodTitle,
        prodDescription,
        prodPrice,
      );
    });
  });
});
