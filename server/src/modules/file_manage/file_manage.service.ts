import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDQuery } from '@/interface';
import { createOrder, fileBuffer2md5, getUploadFileDirPath } from '@/utils';
import { paginationTransform } from '../../utils/whereTransform';
import { In, Like, Repository } from 'typeorm';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { FileManage } from './file_manage.entity';
import fse from 'fs-extra';
import path from 'path';
import filetype from 'file-type';
import { v4 as uuid } from 'uuid';
import { FileManageUpdateDto } from './file_manage.dto';

@Injectable()
export class FileManageService {
  constructor(
    @InjectRepository(FileManage)
    private repository: Repository<FileManage>,
  ) {}

  findAll() {
    return this.repository.find({
      where: { is_delete: false },
    });
  }
  findList({ keyword = '', tags, ...params }: CRUDQuery<FileManage> & { tags?: string[] }) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('file_manage')
      .where({
        is_delete: false,
        name: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    if (tags?.length) {
      find.andWhere({
        tags: In(tags),
      });
    }
    find.leftJoinAndSelect('file_manage.author', 'author');
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('file_manage.' + key, value);
    });

    return find.getManyAndCount();
  }
  findByID(id: string) {
    const info = this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    return info;
  }
  findByName(name: string) {
    const info = this.repository.findOneBy({
      name,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    return info;
  }
  findByHash(hash: string) {
    const info = this.repository.findOneBy({
      hash,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    return info;
  }

  async findById(id: string) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('文件管理不存在', 'file_manage not found');
    }
    return isExisted;
  }

  // 上传本地文件
  async uploadLocal(
    file: Express.Multer.File,
    dirPath: string,
    author: UserAdmin,
    tags?: string[],
  ): Promise<FileManage> {
    const fileMd5 = fileBuffer2md5(file.buffer);
    const dbInfo = await this.repository.findOneBy({
      hash: fileMd5,
    });
    if (dbInfo?.is_delete) {
      // 已删除则变为未删除
      await this.repository.update(dbInfo.id, { is_delete: false });
      return dbInfo;
    }
    let filename = file.originalname;
    const filenameFind = await this.repository.findOneBy({
      name: filename,
    });
    if (filenameFind) {
      const fns = filename.split('.');
      fns.splice(1, 0, '_' + Date.now());
      filename = fns.join('.');
    }
    const fileType = await filetype.fileTypeFromBuffer(file.buffer as Uint8Array);
    const local_path = path.join(dirPath, uuid() + '.' + fileType.ext);
    const saveInfo = await this.repository.save({
      name: filename,
      hash: fileMd5,
      size: file.size,
      type: fileType.mime,
      ext: fileType.ext,
      local_path,
      author,
      tags,
    });

    // 绝对路径
    const absolutePath = path.join(getUploadFileDirPath(), local_path);
    const absoluteDir = path.join(getUploadFileDirPath(), dirPath);
    try {
      await fse.access(absoluteDir);
    } catch (e) {
      await fse.mkdir(absoluteDir, { recursive: true });
    }
    try {
      // 文件 buffer 写入文件
      fse.writeFileSync(absolutePath, file.buffer as Uint8Array);
      return saveInfo;
    } catch (e) {
      console.log('e: ', e);
      // 删了
      this.repository.delete(saveInfo.id);
      throw new BadRequestException('文件写入失败', e);
    }
  }

  // 获取文件绝对路径
  async getFileAbsolutePath(id: string | FileManage): Promise<string> {
    let info: FileManage;
    if (typeof id === 'string') {
      info = await this.repository.findOneBy({
        id,
      });
    } else {
      info = id;
    }
    return path.join(getUploadFileDirPath(), info.local_path);
  }

  // 更新文件信息
  async update({ id, desc }: FileManageUpdateDto) {
    const info = await this.findById(id);
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    return this.repository.update(id, { desc });
  }

  // 将文件移动到回收站
  async remove(id: string) {
    return this.repository.update(id, { is_delete: true });
  }

  // 添加标签
  async addTags(id: string, tags: string[]) {
    const info = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    if (info.tags.some((tag) => tags.includes(tag))) {
      throw new BadRequestException('文件已存在标签');
    }
    // 更新标签
    return this.repository.update(id, {
      tags: [...info.tags, ...tags],
    });
  }

  // 删除标签
  async removeTags(id: string, tags: string[]) {
    const info = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    if (!info.tags.some((tag) => tags.includes(tag))) {
      throw new BadRequestException('文件不存在标签');
    }
    // 更新标签
    return this.repository.update(id, {
      tags: info.tags.filter((tag) => !tags.includes(tag)),
    });
  }
}
