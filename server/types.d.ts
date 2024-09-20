declare namespace NodeJS {
  interface ProcessEnv {
    /** 运行环境 */
    readonly NODE_ENV: 'development' | 'production';
  }
}
