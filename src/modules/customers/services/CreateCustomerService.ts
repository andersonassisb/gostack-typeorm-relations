import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = new CustomersRepository();
    const customerExists = await customersRepository.findByEmail(email);

    if (customerExists) throw new AppError('Customer email is already exists');

    const customer = await customersRepository.create({ name, email });
    return customer;
  }
}

export default CreateCustomerService;
