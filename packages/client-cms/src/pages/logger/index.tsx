import Header from '@/components/Header';
import PageContainer from '@/components/PageContainer';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';
import LoggerDetail from './Detail';
import { getListApi } from './module';

export default function Logger() {
  const { data: list = [] } = useRequest(() => {
    return getListApi().then((res) => res.data.data);
  });

  return (
    <>
      <Header />
      <PageContainer>
        <Tabs
          items={list.map((date) => {
            return {
              label: date,
              key: date,
              children: <LoggerDetail date={date} />,
            };
          })}
        />
      </PageContainer>
    </>
  );
}
