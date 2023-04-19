import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Pagination } from 'src/interface';

/**
 * 将get请求中的分页参数转换为 number 类型
 */
@Injectable()
export class PaginationParseIntPipe
  implements PipeTransform<Pagination, Pagination>
{
  transform(value: Pagination, metadata: ArgumentMetadata): Pagination {
    if (metadata.type !== 'query') {
      return value;
    }
    const newValues = {
      ...value,
    };
    if (value.current) {
      newValues.current = parseInt(value.current + '', 10);
    }
    if (value.page_size) {
      newValues.page_size = parseInt(value.page_size + '', 10);
    }
    return newValues;
  }
}
