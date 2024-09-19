# 前端 SSR

## 限制

1. public 取消，资源由 nest 端控制
2. 页面如需使用服务端数据页面必须要导出 getServerSideProps

```ts
export { getServerSideProps } from '@/lib/ssr';
```

3.
