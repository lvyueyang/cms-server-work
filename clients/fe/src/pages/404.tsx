import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <div>当前页面不存在</div>
      <div>请检查您输入的URL是否正确，或单击下面的按钮返回主页</div>
      <Link href="/">返回首页</Link>
    </div>
  );
}
