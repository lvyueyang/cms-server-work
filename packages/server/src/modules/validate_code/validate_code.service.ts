import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { emailClientConfig } from '@/config';
import { Repository } from 'typeorm';
import { ValidateCode } from './validate_code.entity';

@Injectable()
export class ValidateCodeService {
  mainClient: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @InjectRepository(ValidateCode)
    private repository: Repository<ValidateCode>,
    @Inject(emailClientConfig.KEY)
    private emailConfig: ConfigType<typeof emailClientConfig>,
  ) {
    this.initMainClient();
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
          from: this.emailConfig.from,
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
}
