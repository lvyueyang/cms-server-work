type PromiseReturnType<T extends Promise<any>> = T extends Promise<infer R> ? R : never;

export interface SSRProps<T extends (...args: any) => any> {
  pageData: PromiseReturnType<ReturnType<T>>;
  globalData: any;
}
