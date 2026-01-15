import { Button, Result } from 'antd';
import { Link } from 'umi';

export default function NotFoundPage() {
  return (
    <Result
      style={{ paddingTop: 200 }}
      status="404"
      title="404"
      subTitle="您访问的页面不存在"
      extra={
        <>
          <Link to="/login">
            <Button>去登录</Button>
          </Link>
          <Link to="/">
            <Button type="primary">去首页</Button>
          </Link>
        </>
      }
    />
  );
}
