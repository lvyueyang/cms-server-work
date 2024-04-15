import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, Pagination } from '@/interface';
import { UserAdmin } from '../../modules/user_admin/user_admin.entity';
import { createOrder } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { Like, Repository } from 'typeorm';
import { BannerCreateDto } from './banner.dto';
import { Banner } from './banner.entity';

type FormValues = BannerCreateDto;

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private repository: Repository<Banner>,
  ) {}

  findAll() {
    return this.repository.find({ where: { is_delete: false } });
  }

  findList({
    keyword = '',
    ...params
  }: Pagination & Order<keyof Banner> & { keyword?: string }) {
    return this.repository.findAndCount({
      ...paginationTransform(params),
      ...createOrder(params),
      where: {
        is_delete: false,
        title: Like(`%${keyword.trim()}%`),
      },
    });
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException(
        '广告不存在',
        'banner not found',
      );
    }
    return isExisted;
  }

  async create(data: FormValues, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('广告已存在');
    }
    return this.repository.save({ 
      title: data.title,
      content: data.content,
      cover: data.cover,
      desc: data.desc,
      author
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException(
        '广告不存在',
        'banner not found',
      );
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(id: number, data: Partial<FormValues>) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException(
        '广告不存在',
        'banner not found',
      );
    }
    return this.repository.update(id, {
      title: data.title,
      content: data.content,
      cover: data.cover,
      desc: data.desc,
    });
  }
}
