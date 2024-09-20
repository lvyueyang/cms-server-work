import Client, { SendSmsRequest } from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { BadRequestException } from '@nestjs/common';

export interface SMSClientOptions {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  signName: string;
  templateCode: string;
}

interface SendSmsOption {
  phone: string;
  code: string;
  key: string;
}

export default class SMSClient {
  client: Client;

  constructor(public options: SMSClientOptions) {
    this.client = this.createClient(
      options.accessKeyId,
      options.accessKeySecret,
      options.endpoint,
    );
  }

  createClient(
    accessKeyId: string,
    accessKeySecret: string,
    endpoint: string,
  ): Client {
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
    // 访问的域名
    config.endpoint = endpoint;
    const client = new Client(config);
    return client;
  }

  async sendSms(config: Pick<SendSmsOption, 'code' | 'phone'>) {
    const request = new SendSmsRequest({});
    request.phoneNumbers = config.phone;
    request.signName = this.options.signName;
    request.templateCode = this.options.templateCode;
    request.templateParam = JSON.stringify({ code: config.code.toString() });

    const res = await this.client.sendSms(request);
    if (res.body.code === 'OK') {
      return res;
    }
    if (res.body.code === 'isv.BUSINESS_LIMIT_CONTROL') {
      throw new BadRequestException('频率发送过快');
    }
    throw res;
  }
}
