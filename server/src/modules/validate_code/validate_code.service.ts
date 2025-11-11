import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { aliSmsClientConfig, emailClientConfig } from '@/config';
import { decryptString, encryptString } from '@/utils';
import SMSClient from '@/utils/SMSClient';
import * as svgCaptcha from 'svg-captcha';
import { Repository } from 'typeorm';
import { ValidateCode } from './validate_code.entity';

interface CodeHash {
  value: string;
  expire_date: number;
  data?: Record<string, string>;
}

const IMAGE_CODE_KEY = 'cms2023';

@Injectable()
export class ValidateCodeService {
  mainClient: Transporter<SMTPTransport.SentMessageInfo>;
  smsClient: SMSClient;

  constructor(
    @InjectRepository(ValidateCode)
    private repository: Repository<ValidateCode>,
    @Inject(emailClientConfig.KEY)
    private emailConfig: ConfigType<typeof emailClientConfig>,
    @Inject(aliSmsClientConfig.KEY)
    private aliSmsConfig: ConfigType<typeof aliSmsClientConfig>,
  ) {
    this.initMainClient();
    // console.log('aliSmsConfig: ', aliSmsConfig);
    if (this.aliSmsConfig.templateCode) {
      this.smsClient = new SMSClient({
        templateCode: this.aliSmsConfig.templateCode,
        signName: this.aliSmsConfig.signName,
        accessKeyId: this.aliSmsConfig.accessKeyId,
        accessKeySecret: this.aliSmsConfig.accessKeySecret,
        endpoint: this.aliSmsConfig.endpoint,
      });
    } else {
      console.log('短信未配置，无法使用发送短信相关功能');
    }
  }

  initMainClient() {
    const { host, port, secure, auth } = this.emailConfig;
    if (!host) {
      console.log('邮箱未配置， 无法使用找回密码功能和发送邮件功能');
      return;
    }

    this.mainClient = createTransport({
      host,
      port,
      secure,
      auth,
    });

    this.mainClient.verify(function (error) {
      if (error) {
        console.error(error);
      } else {
        console.log('邮箱客户端链接成功');
      }
    });
  }

  /** 创建6位长度验证码 */
  createCode() {
    const number = Math.floor(Math.random() * 900000) + 100000;
    return number.toString();
  }

  /** 创建验证码 */
  async create(
    { user_id, point_type, code_type }: Pick<ValidateCode, 'code_type' | 'point_type' | 'user_id'>,
    expiresIn: number | Date = 5,
  ) {
    const code = this.createCode();

    let expire_date: Date;
    if (typeof expiresIn === 'number') {
      expire_date = dayjs().set('minute', expiresIn).toDate();
    } else {
      expire_date = expiresIn;
    }

    const current = await this.repository.findOne({
      where: {
        user_id,
        point_type,
        code_type,
      },
    });
    if (current) {
      await this.repository.update(current.id, {
        code,
        expire_date,
      });
      return await this.repository.findOneBy({ id: current.id });
    } else {
      return await this.repository.save({
        user_id,
        point_type,
        code_type,
        code,
        expire_date,
      });
    }
  }

  /** 验证验证码 */
  async validate({
    code_type,
    point_type,
    user_id,
    code,
  }: Pick<ValidateCode, 'code_type' | 'point_type' | 'user_id' | 'code'>) {
    const codeRes = await this.repository.findOne({
      where: {
        code_type,
        point_type,
        user_id,
        code,
      },
    });
    if (!codeRes) {
      return [false, 'code_not_found'];
    }
    if (dayjs().isBefore(dayjs(codeRes.expire_date))) {
      return [false, 'code_expire'];
    }
    return [codeRes];
  }

  senEmail({
    to,
    title,
    content,
  }: {
    title: string;
    content: string;
    to: string;
  }): Promise<SMTPTransport.SentMessageInfo> {
    return new Promise((resolve, reject) => {
      this.mainClient.sendMail(
        {
          from: `CMS <${this.emailConfig.from}>`,
          to,
          subject: title,
          html: content,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        },
      );
    });
  }

  sendSmsCode(phone: string, code: string) {
    return this.smsClient.sendSms({ phone, code });
  }

  createImageCode() {
    const { data, text } = svgCaptcha.create();
    try {
      const hash = this.createHashCode(text);
      return {
        data,
        text,
        hash,
      };
    } catch (e) {
      return e;
    }
  }

  /** 使用 code 生成 带有过期时间的加密过的 hash */
  createHashCode(value: string, data?: Record<string, string>) {
    const hashValue: CodeHash = {
      value,
      data,
      expire_date: dayjs().add(5, 'minutes').unix(),
    };
    const hash = encryptString(JSON.stringify(hashValue), IMAGE_CODE_KEY);
    return hash;
  }

  /** 创建手机短信验证码 */
  createPhoneHashCode(phone: string, key: string) {
    const code = this.createCode();
    const hashValue: CodeHash = {
      value: code,
      data: { phone, key },
      expire_date: dayjs().add(5, 'minutes').unix(),
    };
    const hash = encryptString(JSON.stringify(hashValue), IMAGE_CODE_KEY);
    return { hash, code };
  }
  /** 验证短信验证码 */
  validatePhoneHashCode(options: {
    hashCode: string;
    code: string;
    phone: string;
    key: string; // 自定义 key 区别同手机号的不同用途
  }) {
    try {
      const parseValue = this.parseHash(options.hashCode);
      const {
        value,
        expire_date,
        data: { phone, key },
      } = parseValue;
      // 校验有效期
      if (dayjs(expire_date).isAfter(dayjs())) {
        return false;
      }
      // 用途校验
      if (options.key !== key) {
        return false;
      }
      // 值是否相等
      return (
        value.toLocaleLowerCase() === options.code.toLocaleLowerCase() && options.phone === phone
      );
    } catch (e) {
      return false;
    }
  }

  parseHash(hashCode: string) {
    const data = JSON.parse(decryptString(hashCode, IMAGE_CODE_KEY)) as CodeHash;
    return data;
  }

  /** 验证 code 和 hash */
  validateHashCode(hashCode: string, code: string) {
    const { value, expire_date } = this.parseHash(hashCode);
    // 校验有效期
    if (dayjs(expire_date).isAfter(dayjs())) {
      return false;
    }
    // 值是否相等
    return value.toLocaleLowerCase() === code.toLocaleLowerCase();
  }
}
