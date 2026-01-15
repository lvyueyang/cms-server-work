import { message } from '@/utils/notice';
import { DownloadOutlined } from '@ant-design/icons';
import { ExportFileType } from '@cms/server/const';
import { Dropdown, Button } from 'antd';

export function ExportButton({ exportFn }: { exportFn: (type: ExportFileType) => Promise<void> }) {
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          {
            label: 'Excel',
            key: 'xlsx',
          },
          {
            label: 'Json',
            key: 'json',
          },
        ],
        onClick: ({ key }) => {
          const c = message.loading('导出中...');
          exportFn(key as ExportFileType).finally(() => {
            message.success('导出成功');
            c();
          });
        },
      }}
    >
      <Button type="primary" ghost icon={<DownloadOutlined />}>
        导出
      </Button>
    </Dropdown>
  );
}
