import 'umi/typings';

declare namespace NodeJS {
  interface ProcessEnv {
    /** 打包环境 */
    readonly NODE_ENV: 'development' | 'production';
  }
}

declare module 'grapesjs-preset-newsletter';
declare module 'grapesjs-preset-webpage';
