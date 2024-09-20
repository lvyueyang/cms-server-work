import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }
  create(
    data: Pick<User, 'cname' | 'username' | 'email' | 'password' | 'phone'>,
  ) {
    return this.usersRepository.create({
      cname: data.cname,
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
  }
  update(
    id: number,
    user: Pick<User, 'cname' | 'email' | 'password' | 'phone'>,
  ) {
    return this.usersRepository.update(id, user);
  }
}
