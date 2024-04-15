import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/interface';
import { paginationTransform } from 'src/utils/whereTransform';
import { Repository } from 'typeorm';
import { AdminRoleUpdateDto, AdminRoleUpdatePermissionCodeDto } from './user_admin_role.dto';
import { AdminRole } from './user_admin_role.entity';

@Injectable()
export class AdminRoleService {
  @InjectRepository(AdminRole)
  private repository: Repository<AdminRole>;

  findList(pagination: Pagination) {
    return this.repository.findAndCount(paginationTransform(pagination));
  }
  findByIds(ids: number[]) {
    return this.repository.findBy(ids.map((id) => ({ id })));
  }

  async ids2Codes(ids: number[]) {
    const roles = await this.findByIds(ids);
    const codes: string[] = [];
    roles.forEach((role) => {
      codes.push(...role.permission_code);
    });
    return [...new Set(codes)];
  }

  findOneById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async create({ name, desc }: Pick<AdminRole, 'name' | 'desc'>) {
    const isExisted = await this.repository.findOneBy({
      name,
    });
    if (isExisted) {
      throw new BadRequestException('角色已存在');
    }
    return this.repository.save({
      name,
      desc,
      permission_code: [],
    });
  }

  async update(
    id: number,
    { name, desc, codes }: Partial<AdminRoleUpdateDto & AdminRoleUpdatePermissionCodeDto>,
  ) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('角色不存在', 'role not found');
    }
    return this.repository.update(id, {
      name,
      desc,
      permission_code: codes,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('角色不存在', 'role not found');
    }
    return this.repository.delete(id);
  }
}
