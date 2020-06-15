import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IEditProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = new OrdersRepository();
    const customersRepository = new CustomersRepository();
    const productsRepository = new ProductsRepository();

    const customerIdExists = await ordersRepository.findById(customer_id);

    if (customerIdExists) throw new AppError('This order is already exists');

    const customer = await customersRepository.findById(customer_id);

    const findProducts = await productsRepository.findAllById(products);

    if (!customer || !findProducts) throw new AppError('Not exists');

    const editProducts: IEditProduct[] = findProducts.map(product => {
      return {
        product_id: product.id,
        price: product.price,
        quantity: product.quantity,
      };
    });

    const order = await ordersRepository.create({
      customer,
      products: editProducts,
    });

    return order;
  }
}

export default CreateOrderService;
