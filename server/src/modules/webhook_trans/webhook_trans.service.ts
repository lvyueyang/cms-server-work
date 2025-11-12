import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAdmin } from '../../modules/user_admin/user_admin.entity';
import { createOrder } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { Like, Repository } from 'typeorm';
import { WebhookTransCreateDto } from './webhook_trans.dto';
import { WebhookTrans } from './webhook_trans.entity';
import { createMaxSafeFunction } from '@/utils/sendBox';
import axios from 'axios';
import { CRUDQuery } from '@/interface';

type FormValues = WebhookTransCreateDto;

@Injectable()
export class WebhookTransService {
  constructor(
    @InjectRepository(WebhookTrans)
    private repository: Repository<WebhookTrans>,
  ) {}

  findAll() {
    return this.repository.find({ where: { is_delete: false } });
  }

  findList({ keyword = '', ...params }: CRUDQuery<WebhookTrans>) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};

    const find = this.repository
      .createQueryBuilder('webhook_trans')
      .where({
        is_delete: false,
        desc: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    if (params?.is_available !== undefined) {
      find.andWhere({
        is_available: params.is_available,
      });
    }
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('webhook_trans.' + key, value);
    });

    return find.getManyAndCount();
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('Webhook中转不存在', 'webhook_trans not found');
    }
    return isExisted;
  }

  async create(data: FormValues, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      code: data.code,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('Webhook中转已存在');
    }
    return this.repository.save({
      code: data.code,
      is_available: data.is_available,
      before_hook_func: data.before_hook_func,
      data_trans_func: data.data_trans_func,
      callback_func: data.callback_func,
      desc: data.desc,
      method: data.method,
      url: data.url,
      author,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('Webhook中转不存在', 'webhook_trans not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(id: number, data: Partial<FormValues>) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('Webhook中转不存在', 'webhook_trans not found');
    }
    return this.repository.update(id, {
      code: data.code,
      is_available: data.is_available,
      before_hook_func: data.before_hook_func,
      data_trans_func: data.data_trans_func,
      callback_func: data.callback_func,
      desc: data.desc,
      method: data.method,
      url: data.url,
    });
  }

  async send(key: string, data: any) {
    const info = await this.repository.findOneBy({
      code: key,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('Webhook中转不存在');
    }
    if (!info.is_available) {
      throw new BadRequestException('Webhook中转未启用');
    }

    try {
      // 回调处理
      const cbFunc = createMaxSafeFunction(`return ${info.callback_func}`)();
      const cbData = cbFunc(data);
      // 前置钩子判断
      const beforeHook = createMaxSafeFunction(`return ${info.before_hook_func}`)(data);
      const validate = beforeHook(data);
      if (!validate) {
        return cbData;
      }
      // 数据处理
      const transFunc = createMaxSafeFunction(`return ${info.data_trans_func}`)();
      const transData = transFunc(data);
      await axios({
        method: info.method,
        url: info.url,
        data: transData,
      });
      return cbData;
    } catch (e) {
      throw new BadRequestException('Webhook中转发送失败', e);
    }
  }
}
