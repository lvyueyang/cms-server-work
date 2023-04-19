import 'umi/typings';

declare namespace NodeJS {
  interface ProcessEnv {
    /** 打包环境 */
    readonly NODE_ENV: 'development' | 'production';
  }
}
