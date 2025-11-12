import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationAndOrder, ResponseResult } from '@/interface';
import { WebhookTrans } from './webhook_trans.entity';

const CreateDto = PickType(WebhookTrans, [
  'code',
  'before_hook_func',
  'data_trans_func',
  'callback_func',
  'desc',
  'is_available',
  'method',
  'url',
]);

export class WebhookTransInfo extends WebhookTrans {}

export class WebhookTransList {
  list: WebhookTransInfo[];
  total: number;
}
/** 新增 */
export class WebhookTransCreateDto extends CreateDto {}

/** 修改 */
export class WebhookTransUpdateDto extends PartialType(CreateDto) {}

/** 发送 */
export class WebhookTransSendQueryDto {
  @ApiProperty({
    description: '唯一标识',
  })
  @IsNotEmpty()
  readonly key: string;
}

/** Params */
export class WebhookTransByIdParamDto {
  @ApiProperty({
    description: 'Webhook中转 ID',
  })
  @IsNotEmpty()
  readonly id: WebhookTrans['id'];
}

/** 查询列表 */
export class WebhookTransQueryListDto extends PaginationAndOrder<keyof WebhookTrans> {
  @ApiProperty({ description: 'Webhook中转名称-模糊搜索' })
  keyword?: string;
}

/** 列表 Response */
export class WebhookTransListResponseDto extends ResponseResult {
  data: WebhookTransList;
}

/** 详情 Response */
export class WebhookTransDetailResponseDto extends ResponseResult {
  data: WebhookTransInfo;
}

/** ID Response */
export class WebhookTransDetailIdResponseDto extends ResponseResult {
  data: number;
}
