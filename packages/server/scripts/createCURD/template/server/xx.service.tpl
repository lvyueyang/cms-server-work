import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/interface';
import { UserAdmin } from 'src/modules/user_admin/user_admin.entity';
import { paginationTransform } from 'src/utils/whereTransform';
import { Like, Repository } from 'typeorm';
import { {{entityName}}CreateDto } from './{{name}}.dto';
import { {{entityName}} } from './{{name}}.entity';

type FormValues = {{entityName}}CreateDto;

@Injectable()
export class {{entityName}}Service {
  constructor(
    @InjectRepository({{entityName}})
    private repository: Repository<{{entityName}}>,
  ) {}

  findAll() {
    return this.repository.find({ where: { is_delete: false } });
  }

  findList({ keyword = '', ...pagination }: Pagination & { keyword?: string }) {
    return this.repository.findAndCount({
      ...paginationTransform(pagination),
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
        '{{cname}}不存在',
        '{{name}} not found',
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
      throw new BadRequestException('{{cname}}已存在');
    }
    return this.repository.save({ ...data, author });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException(
        '{{cname}}不存在',
        '{{name}} not found',
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
        '{{cname}}不存在',
        '{{name}} not found',
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
