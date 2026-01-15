import { message } from '@/utils/notice';
import { Button, Card } from 'antd';
import { initRenderViewGlobalDataApi } from './module';

export default function SettingPage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)' }}>
      <Card
        title="重载模板引擎全局数据"
        extra={
          <Button
            type="primary"
            onClick={() => {
              initRenderViewGlobalDataApi().then(() => {
                message.success('重载成功');
              });
            }}
          >
            重载
          </Button>
        }
      >
        点击重载按钮，会重新加载所有模板引擎全局数据。
      </Card>
    </div>
  );
}
