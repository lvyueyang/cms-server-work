import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/interface';
import { UserAdmin } from 'src/modules/user_admin/user_admin.entity';
import { paginationTransform } from 'src/utils/whereTransform';
import { LessThan, Like, MoreThan, Repository } from 'typeorm';
import { NewsCreateDto } from './news.dto';
import { News } from './news.entity';

type FormValues = NewsCreateDto;

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private repository: Repository<News>,
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
      throw new BadRequestException('新闻中心不存在', 'news not found');
    }
    return isExisted;
  }

  async findNextAndPrev(id: number) {
    const currentNews = await this.findById(id);
    const [nextNews, prevNews] = await Promise.all([
      this.repository.findOne({
        where: {
          id: LessThan(id),
          is_delete: false,
        },
        order: {
          id: 'DESC',
        },
      }),
      this.repository.findOne({
        where: {
          id: MoreThan(id),
          is_delete: false,
        },
        order: {
          id: 'ASC',
        },
      }),
    ]);
    return {
      next: nextNews || null,
      prev: prevNews || null,
      current: currentNews,
    };
  }

  async create(data: FormValues, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('新闻中心已存在');
    }
    return this.repository.save({
      title: data.title,
      content: data.content,
      cover: data.cover,
      desc: data.desc,
      author,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('新闻中心不存在', 'news not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(id: number, data: Partial<FormValues>) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('新闻中心不存在', 'news not found');
    }
    return this.repository.update(id, {
      title: data.title,
      content: data.content,
      cover: data.cover,
      desc: data.desc,
    });
  }
}
