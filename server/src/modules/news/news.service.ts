import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDQuery } from '@/interface';
import { createOrder } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { LessThan, Like, MoreThan, Repository } from 'typeorm';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { News } from './news.entity';
import { NewsCreateDto, NewsUpdateDto } from './news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private repository: Repository<News>,
  ) {}

  findAll() {
    return this.repository.find({
      where: { is_delete: false },
    });
  }

  findList({ keyword = '', ...params }: CRUDQuery<News>) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('news')
      .where({
        is_delete: false,
        title: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('news.' + key, value);
    });
    /** 在 push_date 为空时,按创建时间排序 */
    find.addOrderBy('COALESCE(news.push_date, news.create_date)', 'DESC');
    return find.getManyAndCount();
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('新闻不存在', 'product not found');
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

  async create(data: NewsCreateDto, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('新闻已存在');
    }
    return this.repository.save({
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      content: data.content,
      recommend: data.recommend,
      push_date: data.push_date,
      is_available: data.is_available,
      author,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('新闻不存在', 'product not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(data: Partial<NewsUpdateDto>) {
    const isExisted = await this.repository.findOneBy({
      id: data.id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('新闻不存在', 'product not found');
    }
    return this.repository.update(data.id, {
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      content: data.content,
      recommend: data.recommend,
      push_date: data.push_date,
      is_available: data.is_available,
    });
  }
}
