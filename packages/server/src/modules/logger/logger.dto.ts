import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseResult } from 'src/interface';

export class LoggerListResponseDto extends ResponseResult {
  @ApiProperty({ description: '日志列表' })
  data: string[];
}
export class LoggerDetailResponseDto extends ResponseResult {
  @ApiProperty({ description: '日志详情' })
  data: string[];
}

export class LoggerByDateResponseDto extends ResponseResult {
  @ApiProperty({
    description: '日期',
  })
  readonly data: string;
}

export class LoggerByDateParamDto {
  @ApiProperty({
    description: '日期',
  })
  @IsNotEmpty()
  readonly date: string;

  // @ApiProperty({
  //   description: '类型',
  // })
  // @IsNotEmpty()
  // readonly type: 'error';
}
