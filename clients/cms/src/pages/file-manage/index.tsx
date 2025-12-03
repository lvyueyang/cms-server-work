import { FileManageInfo, FileManageUpdateDto } from '@cms/api-interface';
import { fileToUrl, formatFileSize, transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal } from 'antd';
import { useRef, useState } from 'react';
import { getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import UploadFile from '@/components/UploadFile';
import PageTable from '@/components/PageTable';

type TableItem = FileManageInfo;

export default function FileManagePage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const [uploadModal, setUploadModal] = useState({
    open: false,
    tags: [],
  });

  const formModal = useFormModal<FileManageUpdateDto>({
    submit: (values, modal) => {
      return updateApi(values).then(() => {
        tableRef.current?.reload();
      });
    },
  });

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'name',
      title: '文件名',
      width: 200,
      sorter: true,
    },
    {
      dataIndex: 'size',
      title: '文件大小',
      sorter: true,
      width: 120,
      render: (_, { size }) => {
        return formatFileSize(size);
      },
    },
    {
      dataIndex: 'desc',
      title: '描述',
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'type',
      title: '文件类型',
      width: 120,
      sorter: true,
    },
    {
      dataIndex: 'ext',
      title: '扩展名',
      width: 100,
      sorter: true,
    },
    {
      dataIndex: 'tags',
      title: '文件标签',
      ellipsis: true,
      width: 140,
      render: (_, { tags }) => {
        return tags.join(', ');
      },
    },
    {
      dataIndex: 'author',
      title: '创建者',
      sorter: true,
      width: 120,
      render: (_, { author }) => {
        return author?.cname || '-';
      },
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      fixed: 'right',
      render: (_, row) => {
        return (
          <Space>
            <a href={fileToUrl(row.id)} target="_blank" rel="noreferrer">
              下载
            </a>
            <a
              onClick={() => {
                formModal.form.setFieldsValue(row);
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定要删除这个文件吗？"
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
        scroll={{ x: 1200 }}
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
            placeholder="请输入文件名称搜索"
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
              setUploadModal({
                open: true,
                tags: [],
              });
            }}
          >
            上传文件
          </Button>,
        ]}
      />
      <Modal
        title="文件上传"
        width={700}
        open={uploadModal.open}
        onCancel={() => {
          setUploadModal({
            open: false,
            tags: [],
          });
        }}
        footer={null}
        maskClosable={false}
        keyboard={false}
      >
        <br />
        <UploadFile
          onChange={(url) => {
            console.log('url: ', url);
            tableRef.current?.reload();
          }}
        />
        <br />
      </Modal>
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}文件`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
      >
        <br />
        <Form form={formModal.form} labelCol={{ span: 4 }} initialValues={{ redundancy_count: 1 }}>
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item label="文件ID" name="id" hidden>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="文件名称" name="name" rules={[{ required: true }]}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
