import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { Order } from '@/interface';
import { Readable } from 'stream';
import { ContentLang } from '@/constants';

const homedir = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];

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
    const addresses = interfaces[interfaceName];
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
const workConfigJson = fs
  .readFileSync(path.join(process.cwd(), '../', 'work.config.json'))
  .toString('utf-8');

export function getWorkConfig() {
  return JSON.parse(workConfigJson) as { cms_admin_path: string };
}

/** 获取资源存储目录地址 */
export const getDataDirPath = () => {
  if (dataDirPath) return dataDirPath;
  const defPath = process.env.FILE_DATA_DIR_PATH;
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
  return path.join(homedir, dir.slice(2));
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

const iv = 'cms-admin-iv';
/** 文字加密 */
export function encryptString(input: string, password: string): string {
  const cipher = createCipheriv('aes-256-cbc', password, iv);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/** 文字解密 */
export function decryptString(input: string, password: string): string {
  const decipher = createDecipheriv('aes-256-cbc', password, iv);
  let decrypted = decipher.update(input, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/** 文件计算md5 */
export function getFileMd5(file: Express.Multer.File) {
  return new Promise((resolve, reject) => {
    const md5sum = createHash('md5');
    const stream = fs.createReadStream(file.path);
    stream.on('data', function (chunk) {
      md5sum.update(chunk as string);
    });
    stream.on('end', function () {
      resolve(md5sum.digest('hex').toUpperCase());
    });
    stream.on('error', function (err) {
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
    stream.on('data', function (chunk) {
      md5sum.update(chunk as string);
    });
    stream.on('end', function () {
      resolve(md5sum.digest('hex').toUpperCase());
    });
    stream.on('error', function (err) {
      reject(err);
    });
  });
}

// 是否为默认国际化语言
export function isDefaultI18nLang(lang?: string | ContentLang) {
  if (!lang || lang === ContentLang.ZH_CN) return true;
  return false;
}
