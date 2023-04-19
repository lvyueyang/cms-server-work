import { useRequest } from 'ahooks';
import { Card, Collapse, Tag } from 'antd';
import { getDetailApi } from './module';

interface DetailProps {
  date: string;
}

export default function LoggerDetail({ date }: DetailProps) {
  const { data } = useRequest(() => {
    return getDetailApi(date).then((res) => res.data.data);
  });

  return (
    <Card size="small">
      {!data?.length ? (
        <>无事发生</>
      ) : (
        <Collapse>
          {data?.map((item, index) => {
            return (
              <Collapse.Panel
                header={
                  <>
                    <Tag>{item.context}</Tag>
                    <span>{item.message}</span>
                  </>
                }
                key={index}
              >
                <div>{item.trace}</div>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      )}
    </Card>
  );
}
