import { TrackMetaEventCreateDto } from '@/modules/track_meta_event/track_meta_event.dto';

// 预置元事件
export const TRACK_META_EVENTS: TrackMetaEventCreateDto[] = [
  {
    name: 'client_user_register',
    cname: '客户注册',
    properties: ['phone', 'email', 'ip'],
  },
  {
    name: 'client_user_login',
    cname: '客户登录',
    properties: ['phone', 'email', 'login_type', 'ip'],
  },
  {
    name: 'client_user_reset_password',
    cname: '客户重置密码',
    properties: ['ip', 'phone'],
  },
  {
    name: 'client_user_logout',
    cname: '客户登出',
    properties: ['ip'],
  },
  {
    name: 'file_download',
    cname: '文件下载',
    properties: ['ip', 'file_id', 'file_name'],
  },
];
