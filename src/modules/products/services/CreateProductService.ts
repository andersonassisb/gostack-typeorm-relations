import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = new ProductsRepository();
    const productNameExists = await productsRepository.findByName(name);

    if (productNameExists) throw new AppError('Product name is already exists');

    const product = await productsRepository.create({
      name,
      price,
      quantity,
    });

    return product;
  }
}

export default CreateProductService;
