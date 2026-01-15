declare namespace NodeJS {
  interface ProcessEnv {
    /** 运行环境 */
    readonly NODE_ENV: 'development' | 'production';
  }
}

// Window 类型定义
interface Window {
  /** 语言 */
  lang: ContentLang;
  /** 本地语言资源 */
  locals: Record<ContentLang, Record<string, string>>;
}
