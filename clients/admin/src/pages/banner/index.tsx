import { AvailableSwitch } from '@/components/Available';
import { BannerCreateDto, BannerInfo, BannerUpdateDto } from '@cms/api-interface';
import { createI18nColumn, transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import UploadImage from '@/components/UploadImage';
import { RecommendFormItem } from '@/components/RecommendFormItem';
import PageTable from '@/components/PageTable';
import { DictSelect } from '../dict/module/Select';
import { DictPreview } from '../dict/module/Preview';
import Editor from '@/components/Editor';
import { ContentType } from '@/constants';
import { TableColumnSort } from '@/components/TableColumnSort';

type TableItem = BannerInfo;
type CreateFormValues = BannerCreateDto;
type UpdateFormValues = BannerUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('banner');

export default function BannerPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const formModal = useFormModal<FormValues>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE) {
        return updateApi(values as UpdateFormValues).then(() => {
          tableRef.current?.reload();
        });
      }
      return createApi(values as CreateFormValues).then(() => {
        tableRef.current?.reload();
      });
    },
  });

  const columns: ProColumns<TableItem>[] = [
    i18nColumn({
      dataIndex: 'cover',
      title: '封面',
      width: 85,
      transType: ContentType.IMAGE,
    }),
    i18nColumn({
      dataIndex: 'title',
      title: '名称',
      sorter: true,
      width: 160,
    }),
    {
      dataIndex: 'position',
      title: '位置',
      sorter: true,
      width: 160,
      render: (_, row) => {
        return <DictPreview type="banner_position" value={row.position} />;
      },
    },
    {
      dataIndex: 'recommend',
      title: '排序',
      sorter: true,
      width: 100,
      render: (_, row) => {
        return (
          <TableColumnSort
            value={row.recommend}
            request={(value) =>
              updateApi({
                id: row.id,
                recommend: value,
              })
            }
          />
        );
      },
    },
    {
      dataIndex: 'is_available',
      title: '是否可用',
      width: 100,
      render: (_, row) => {
        return (
          <AvailableSwitch
            value={row.is_available}
            tableRef={tableRef}
            request={() =>
              updateApi({
                id: row.id,
                is_available: !row.is_available,
              })
            }
          />
        );
      },
    },
    i18nColumn({
      dataIndex: 'desc',
      title: '描述',
      width: 160,
      ellipsis: true,
    }),
    i18nColumn({
      dataIndex: 'url',
      title: '链接',
      width: 100,
      ellipsis: true,
    }),
    i18nColumn({
      dataIndex: 'content',
      title: '内容',
      width: 50,
      ellipsis: true,
      transType: ContentType.Rich,
    }),
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      width: 180,
      sorter: true,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      sorter: true,
      width: 180,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      render: (_, row) => {
        return (
          <Space>
            <a
              onClick={() => {
                formModal.form.setFieldsValue(row);
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定要删除这个广告吗？"
              onConfirm={() => {
                const close = message.loading('删除中...', 0);
                removeApi(row.id)
                  .then(() => {
                    message.success('删除成功');
                    tableRef.current?.reload();
                  })
                  .finally(() => {
                    close();
                  });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        search={false}
        request={(params, sorter) => {
          return getListApi({
            ...transformPagination(params),
            ...transformSort(sorter),
            ...searchForm,
          }).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        headerTitle={
          <Input.Search
            value={searchForm.keyword}
            onChange={(e) => {
              setSearchForm((state) => ({
                ...state,
                keyword: e.target.value.trim(),
              }));
            }}
            allowClear
            style={{ width: 400 }}
            placeholder="请输入广告名称搜索"
            enterButton={<>搜索</>}
            onSearch={() => {
              tableRef.current?.setPageInfo?.({ current: 1 });
              tableRef.current?.reload();
            }}
          />
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              // history.push('/banner/create');
              formModal.form.resetFields();
              formModal.formModalShow();
            }}
          >
            新增广告
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}广告`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
        width={900}
        destroyOnHidden
      >
        <br />
        <Form form={formModal.form} labelCol={{ span: 4 }} initialValues={{ redundancy_count: 1 }}>
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item label="广告ID" name="id" hidden>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="广告标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="广告位置" name="position" rules={[{ required: true }]}>
            <DictSelect type="banner_position" />
          </Form.Item>
          <Form.Item
            label="广告封面"
            name="cover"
            rules={[{ required: true, message: '请上传广告封面' }]}
          >
            <UploadImage />
          </Form.Item>
          <Form.Item label="上架状态" name="is_available" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
          <RecommendFormItem />
          <Form.Item label="广告描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="广告链接" name="url">
            <Input />
          </Form.Item>
          <Form.Item label="内容" name="content">
            <Editor />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
