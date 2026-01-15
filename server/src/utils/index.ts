import { type BinaryLike, type CipherKey, createCipheriv, createDecipheriv, createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type { Readable } from 'node:stream';
import * as fse from 'fs-extra';
import { ContentLang } from '@/constants';
import type { Order } from '@/interface';
import type { FileManage } from '@/modules/file_manage/file_manage.entity';

const homedir = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
if (!homedir) {
  console.warn('无法获取用户主目录 homedir 不存在');
}
let dataDirPath = ''; // 资源存储目录
let logDataDirPath = ''; // 日志目录
let uploadFileDataDirPath = ''; // 文件上传目录

/** 密码加盐 */
export const passwordCrypto = (passwordStr: string, salt: string) => {
  const saltPassword = passwordStr + ':' + salt;
  const md5 = createHash('md5');
  const result = md5.update(saltPassword).digest('hex');

  return result;
};

/** 获取本机 IPV4 地址 */
export function getLocalIPv4Address() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName] || [];
    for (const address of addresses) {
      if (!address.internal && address.family === 'IPv4') {
        return address.address;
      }
    }
  }
  return undefined;
}

/** 请求成功后返回的数据格式 */
export function successResponse<T>(data: T, message = '请求成功') {
  return {
    statusCode: 200,
    message,
    data,
  };
}
const workConfigJson = fs.readFileSync(path.join(process.cwd(), '../', 'work.config.json')).toString('utf-8');

export function getWorkConfig() {
  return JSON.parse(workConfigJson) as { cms_admin_path: string };
}

/** 获取资源存储目录地址 */
export const getDataDirPath = () => {
  if (dataDirPath) return dataDirPath;
  const defPath = process.env.FILE_DATA_DIR_PATH;
  if (!defPath) {
    throw new Error('请配置 FILE_DATA_DIR_PATH 环境变量');
  }
  const dataDir = expandHomeDir(defPath);
  fse.ensureDirSync(dataDir);
  dataDirPath = dataDir;
  return dataDir;
};

/** 用户上传文件存储位置 */
export const getUploadFileDirPath = () => {
  if (uploadFileDataDirPath) {
    return uploadFileDataDirPath;
  }
  const dataPath = getDataDirPath();
  const uploadFileDir = path.join(dataPath, 'uploadfile');
  fse.ensureDirSync(uploadFileDir);
  uploadFileDataDirPath = uploadFileDir;
  return uploadFileDir;
};

/** 日志文件存储位置 */
export const getLogDirPath = () => {
  if (logDataDirPath) {
    return logDataDirPath;
  }
  const dataPath = getDataDirPath();
  const logDir = path.join(dataPath, 'logs');
  fse.ensureDirSync(logDir);
  logDataDirPath = logDir;
  return logDir;
};
function expandHomeDir(dir: string) {
  if (!dir || !dir.startsWith('~/')) return dir;
  if (!homedir) {
    console.log('无法获取用户主目录 homedir 不存在');
  }
  return path.join(homedir || '', dir.slice(2));
}

/** 创建排序查询 */
export function createOrder<T extends Record<string, any>>({ order_key, order_type }: Order<T>) {
  if (order_key && order_type) {
    return {
      order: {
        [order_key]: order_type,
      },
    };
  }
}

const iv = Buffer.alloc(16, 'cms_admin_iv_2025'); // Ensure 16 bytes
/** 文字加密 */
export function encryptString(input: string, password: string): string {
  // aes-256-cbc requires 32 byte key
  const key = createHash('sha256').update(password).digest();
  const cipher = createCipheriv('aes-256-cbc', key as CipherKey, iv as BinaryLike);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/** 文字解密 */
export function decryptString(input: string, password: string): string {
  // aes-256-cbc requires 32 byte key
  const key = createHash('sha256').update(password).digest();
  const decipher = createDecipheriv('aes-256-cbc', key as CipherKey, iv as BinaryLike);
  let decrypted = decipher.update(input, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/** 文件计算md5 */
export function getFileMd5(file: Express.Multer.File) {
  return new Promise((resolve, reject) => {
    const md5sum = createHash('md5');
    const stream = fs.createReadStream(file.path);
    stream.on('data', (chunk) => {
      md5sum.update(chunk as string);
    });
    stream.on('end', () => {
      resolve(md5sum.digest('hex').toUpperCase());
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
}

export function fileBuffer2md5(buffer: Buffer) {
  const md5sum = createHash('md5');
  md5sum.update(buffer as Uint8Array);
  return md5sum.digest('hex').toUpperCase();
}

export function streamReadable2md5(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const md5sum = createHash('md5');
    stream.on('data', (chunk) => {
      md5sum.update(chunk as string);
    });
    stream.on('end', () => {
      resolve(md5sum.digest('hex').toUpperCase());
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// 是否为默认国际化语言
export function isDefaultI18nLang(lang?: string | ContentLang) {
  if (!lang || lang === ContentLang.ZH_CN) return true;
  return false;
}

/** 合并 className */
export function cls(...classList: (string | undefined | boolean)[]) {
  return classList.filter((i) => !!i).join(' ');
}

export function fileToUrl(file: FileManage | string, useName?: boolean) {
  const prefix = useName ? 'getfilebyname' : 'getfile';
  if (typeof file === 'string') {
    return `/${prefix}/${file}`;
  }
  return `/${prefix}/${useName ? file.name : file.id}`;
}

export function safeJsonParse<T>(val: string) {
  try {
    const result = JSON.parse(val);
    return result as T;
  } catch (e) {
    return void 0;
  }
}
