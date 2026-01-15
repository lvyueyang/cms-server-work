import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as svgCaptcha from 'svg-captcha';
import { LessThan, Repository } from 'typeorm';
import { aliSmsClientConfig, emailClientConfig } from '@/config';
import { VALIDATE_CODE_TYPE } from '@/constants';
import { decryptString, encryptString } from '@/utils';
import SMSClient from '@/utils/SMSClient';
import { ValidateCode } from './validate_code.entity';

interface CodeHash<T = Record<string, string>> {
  value: string;
  expire_date: number;
  data?: T;
}

const IMAGE_CODE_KEY = 'cms2023';

@Injectable()
export class ValidateCodeService {
  private readonly logger = new Logger(ValidateCodeService.name);

  constructor(
    @InjectRepository(ValidateCode)
    private repository: Repository<ValidateCode>
  ) {}

  // 清理过期的验证码
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanExpiredCodes() {
    this.logger.log('开始清理过期验证码...');
    const result = await this.repository.delete({
      expire_date: LessThan(dayjs().toDate()),
    });
    this.logger.log(`清理过期验证码 ${result.affected} 条`);
  }
}

// 短信验证码服务
@Injectable()
export class ValidateCodeBySMSService {
  private smsClient: SMSClient;

  constructor(
    @InjectRepository(ValidateCode)
    private repository: Repository<ValidateCode>,
    @Inject(aliSmsClientConfig.KEY)
    private aliSmsConfig: ConfigType<typeof aliSmsClientConfig>
  ) {
    if (
      !this.aliSmsConfig.accessKeyId ||
      !this.aliSmsConfig.accessKeySecret ||
      !this.aliSmsConfig.endpoint ||
      !this.aliSmsConfig.templateCode ||
      !this.aliSmsConfig.signName
    ) {
      setTimeout(() => {
        console.warn('短信配置缺失, 会影响发送短信相关功能');
      }, 0);
    }
    this.smsClient = new SMSClient({
      templateCode: this.aliSmsConfig.templateCode || '',
      signName: this.aliSmsConfig.signName || '',
      accessKeyId: this.aliSmsConfig.accessKeyId || '',
      accessKeySecret: this.aliSmsConfig.accessKeySecret || '',
      endpoint: this.aliSmsConfig.endpoint || '',
    });
  }

  // 创建并发送短信验证码
  async createAndSendCode(phone: string, type: VALIDATE_CODE_TYPE) {
    const code = createCode();
    await this.smsClient.sendSms({ phone, code });
    const info = await this.repository.save({
      key: phone,
      code,
      code_type: type,
      expire_date: dayjs().add(5, 'minutes').toDate(),
    });
    return info;
  }

  // 校验短信验证码
  async validateCode({ phone, type, code }: { phone: string; type: VALIDATE_CODE_TYPE; code: string }) {
    try {
      const info = await this.repository.findOne({
        where: {
          key: phone,
          code_type: type,
        },
      });
      if (!info) {
        return [null, '验证码不存在'] as const;
      }
      if (dayjs(info.expire_date).isBefore(dayjs())) {
        return [null, '验证码已过期'] as const;
      }
      if (info.code !== code) {
        return [null, '验证码错误'] as const;
      }
      return [info, null] as const;
    } catch (error) {
      return [null, '数据库查询失败'] as const;
    }
  }
}

// 邮箱验证码服务
@Injectable()
export class ValidateCodeByEmailService {
  private mailClient: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(
    @Inject(emailClientConfig.KEY)
    private emailConfig: ConfigType<typeof emailClientConfig>,
    @InjectRepository(ValidateCode)
    private repository: Repository<ValidateCode>
  ) {
    const { host, port, secure, auth } = this.emailConfig;
    if (!host) {
      console.log('邮箱未配置， 无法使用找回密码功能和发送邮件功能');
      return;
    }

    this.mailClient = createTransport({
      host,
      port,
      secure,
      auth,
    });

    this.mailClient.verify((error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('邮箱客户端链接成功');
      }
    });
  }

  // 创建并发送邮箱验证码
  async createAndSendCode(title: string, email: string, type: VALIDATE_CODE_TYPE) {
    const code = createCode();
    await this.mailClient.sendMail({
      from: `xxxx <${this.emailConfig.from}>`,
      to: email,
      subject: title,
      html: codeTemplate(title, code),
    });
    const info = await this.repository.save({
      key: email,
      code,
      code_type: type,
      expire_date: dayjs().add(5, 'minutes').toDate(),
    });
    return info;
  }

  // 校验邮箱验证码
  async validateCode({ email, type, code }: { email: string; type: VALIDATE_CODE_TYPE; code: string }) {
    try {
      const info = await this.repository.findOne({
        where: {
          key: email,
          code_type: type,
        },
        order: {
          create_date: 'DESC',
        },
      });
      if (!info) {
        return [null, '验证码不存在'] as const;
      }
      if (dayjs(info.expire_date).isBefore(dayjs())) {
        return [null, '验证码已过期'] as const;
      }
      if (info.code !== code) {
        return [null, '验证码错误'] as const;
      }
      return [info, null] as const;
    } catch (error) {
      return [null, '数据库查询失败'] as const;
    }
  }
}

// 图片验证码服务
@Injectable()
export class ValidateCodeByImageService {
  static IMAGE_CODE_KEY = 'cms2023';

  constructor(
    @InjectRepository(ValidateCode)
    private repository: Repository<ValidateCode>
  ) {}

  // 创建验证码
  create() {
    const { data, text } = svgCaptcha.create();
    const hash = this.createHashCode(text);
    return {
      data,
      text,
      hash,
    };
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

  parseHash<T = Record<string, string>>(hashCode: string) {
    const data = JSON.parse(decryptString(hashCode, IMAGE_CODE_KEY)) as CodeHash<T>;
    return data;
  }

  /** 验证 code 和 hash */
  validate(hashCode: string, code: string) {
    const { value, expire_date } = this.parseHash(hashCode);
    // 校验有效期
    if (dayjs(expire_date).isAfter(dayjs())) {
      return false;
    }
    // 值是否相等
    return value.toLocaleLowerCase() === code.toLocaleLowerCase();
  }
}

// 创建6位长度验证码
function createCode() {
  const number = Math.floor(Math.random() * 900000) + 100000;
  return number.toString();
}

// 验证码邮件模板
function codeTemplate(title: string, code: string) {
  return `<div style="width: 600px;margin: 20px auto;color:#000;background:#fff;border: 1px solid #415A94;">
  <div style="padding-left:30px;background-color:#415A94;color:#fff;padding:20px 40px;font-size: 21px;">xxxx</div>
  <div style="padding:40px;">
    <div style="font-size:24px;line-height:1.5;">${title}</div>
    <div style="margin-top: 15px;">
      <span>您的验证码是：</span>
      <span style="padding: 0 3px;font-size: 18px;">
        <b>${code}</b>
      </span>
      <span>，请在 5 分钟内进行验证。如果该验证码不为您本人申请，请无视。</span>
    </div>
  </div>
</div>`;
}
