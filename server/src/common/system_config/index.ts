export interface PresetSystemConfig {
  title: string;
  content_type?: string;
  content: Record<string, any> | any[] | string;
}
export const SYSTEM_CONFIG_PRESET: Record<string, PresetSystemConfig> = {
  company_email: {
    title: '公司邮箱',
    content: 'xxx@main.com',
  },
  company_tell: {
    title: '公司电话',
    content: '0000-0000-000',
  },
  company_address: {
    title: '公司地址',
    content: 'xxxxx',
  },
  company_address_url: {
    title: '公司地址地图连接',
    content: '',
  },
  // 自定义顶部代码
  custom_header_code: {
    title: '自定义全局顶部代码',
    content_type: 'code',
    content: '',
  },
  // 自定义底部代码
  custom_footer_code: {
    title: '自定义全局底部代码',
    content_type: 'code',
    content: '',
  },
  // keywords
  keywords: {
    title: '关键词',
    content_type: 'text',
    content: '',
  },
  // 开启/关闭国际化
  i18n_enabled: {
    title: '开启(1)/关闭(0)国际化',
    content_type: 'input',
    content: '1',
  },
} as const;
