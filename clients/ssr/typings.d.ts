/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** 打包环境 */
    readonly NODE_ENV: 'development' | 'production';
  }
}

declare module 'grapesjs-preset-newsletter';
declare module 'grapesjs-preset-webpage';

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}
