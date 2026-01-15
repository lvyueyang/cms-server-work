import { META_PROPERTIES_TYPE } from '@/constants';
import { TrackMetaPropertiesCreateDto } from '@/modules/track_meta_properties/track_meta_properties.dto';

// 预置元属性
export const TRACK_META_PROPERTY: TrackMetaPropertiesCreateDto[] = [
  {
    name: 'ip',
    cname: 'IP地址',
    type: META_PROPERTIES_TYPE.STRING,
  },
  {
    name: 'phone',
    cname: '手机号',
    type: META_PROPERTIES_TYPE.STRING,
  },
  {
    name: 'email',
    cname: '邮箱',
    type: META_PROPERTIES_TYPE.STRING,
  },
  {
    name: 'url',
    cname: 'URL',
    type: META_PROPERTIES_TYPE.STRING,
  },
  {
    name: 'login_type',
    cname: '登录方式',
    type: META_PROPERTIES_TYPE.STRING,
  },
  {
    name: 'start_date_time',
    cname: '开始时间',
    type: META_PROPERTIES_TYPE.DATETIME,
  },
  {
    name: 'end_date_time',
    cname: '结束时间',
    type: META_PROPERTIES_TYPE.DATETIME,
  },
  {
    name: 'file_id',
    cname: '文件ID',
    type: META_PROPERTIES_TYPE.STRING,
  },
  {
    name: 'file_name',
    cname: '文件名',
    type: META_PROPERTIES_TYPE.STRING,
  },
];
