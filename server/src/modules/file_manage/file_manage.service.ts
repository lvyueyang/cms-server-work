import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import filetype, { FileTypeResult } from 'file-type';
import fse from 'fs-extra';
import { In, Like, Repository } from 'typeorm';
import { ContentLang } from '@/constants';
import { CRUDQuery } from '@/interface';
import { createOrder, fileBuffer2md5, getUploadFileDirPath, isDefaultI18nLang } from '@/utils';
import { paginationTransform } from '../../utils/whereTransform';
import { ContentTranslationService, StringKeys } from '../content_translation/content_translation.service';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { FileManageRenameDto, FileManageUpdateDto } from './file_manage.dto';
import { FileManage } from './file_manage.entity';

@Injectable()
export class FileManageService {
  static I18N_KEY = 'file_manage';
  static I18N_FIELDS: StringKeys<FileManage>[] = ['name'];

  constructor(
    @InjectRepository(FileManage)
    private repository: Repository<FileManage>,
    private contentTranslationService: ContentTranslationService
  ) {}

  async i18nTrans(res: FileManage[], lang?: ContentLang) {
    if (lang && !isDefaultI18nLang(lang)) {
      return this.contentTranslationService.overlayTranslations(res, {
        entity: FileManageService.I18N_KEY,
        fields: FileManageService.I18N_FIELDS,
        lang,
      });
    }
    return res;
  }

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
    find.orWhere({
      id: keyword,
    });
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
  // 文件地址转换为文件实体
  async fileIDUrl2File(urls: string[], lang?: ContentLang) {
    const ids = urls.map((url) => {
      const id = url.split('?')[0].split('/').pop();
      return id;
    });
    const files = await this.repository.find({
      where: {
        id: In(ids),
        is_delete: false,
      },
    });
    return this.i18nTrans(files, lang);
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
    tags?: string[]
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
    // 中文文件名需要编码
    let filename = file.originalname;
    // 尝试修正编码
    try {
      filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (e) {
      console.warn('filename decode error:', e);
    }
    const filenameFind = await this.repository.findOneBy({
      name: filename,
    });
    if (filenameFind) {
      const fns = filename.split('.');
      fns.splice(1, 0, '_' + Date.now());
      filename = fns.join('.');
    }
    const ft: FileTypeResult | undefined = await filetype.fromBuffer(file.buffer as Uint8Array);
    const mime = ft?.mime || 'application/octet-stream';
    const ext = ft?.ext || file.originalname.split('.').pop();
    const local_path = path.join(dirPath, randomUUID() + (ext ? '.' + ext : '_' + file.originalname));
    const saveInfo = await this.repository.save({
      name: filename,
      hash: fileMd5,
      size: file.size,
      type: mime,
      ext: ext,
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
      throw new BadRequestException('文件写入失败', e!);
    }
  }

  // 获取文件绝对路径
  async getFileAbsolutePath(id: string | FileManage): Promise<string> {
    let info: FileManage;
    if (typeof id === 'string') {
      const infoFind = await this.repository.findOneBy({
        id,
      });
      if (!infoFind) {
        throw new BadRequestException('文件不存在', 'file_manage not found');
      }
      info = infoFind;
    } else {
      info = id;
    }
    return path.join(getUploadFileDirPath(), info.local_path);
  }

  // 更新文件信息
  async update({ id, desc, login_download_auth }: FileManageUpdateDto) {
    const info = await this.findById(id);
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    return this.repository.update(id, { desc, login_download_auth });
  }

  // 文件重命名
  async rename({ id, name }: FileManageRenameDto) {
    const info = await this.findById(id);
    if (!info) {
      throw new BadRequestException('文件不存在', 'file_manage not found');
    }
    const old = await this.repository.findBy({ name });
    if (old.length > 0) {
      throw new BadRequestException('文件名已存在');
    }
    return this.repository.update(id, { name });
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
