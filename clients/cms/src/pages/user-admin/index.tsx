import { ConfirmPasswordItem } from '@/components/ConfirmPasswordItem';
import PageContainer from '@/components/PageContainer';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import { UserAdminCreateDto, UserAdminInfo } from '@cms/api-interface';
import { transformPagination } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Form, Input, Modal, Space, Spin, Tag, Transfer } from 'antd';
import { Key, useRef, useState } from 'react';
import { getListApi as getRoleListApi } from '../admin-role/module/services';
import { createUser, getUserList, resetpasswordUser, updateRole, updateUser } from './module';

type TableItem = UserAdminInfo;

class RoleModalState {
  user?: number;
  open: boolean = false;
  loading: boolean = false;
  values: Key[] = [];
}

export default function UserAdminList() {
  const tableRef = useRef<ActionType>();
  const [roleModal, setRoleModal] = useState(new RoleModalState());

  const { data: roleList } = useRequest(() => {
    return getRoleListApi({ current: 1, page_size: 10000 }).then((res) => res.data.data.list);
  });

  const {
    submitLoading,
    form,
    formModal,
    formModalShow,
    formModalClose,
    submitHandler,
    formModalTitle,
  } = useFormModal<UserAdminCreateDto & { id?: number }>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE && values.id) {
        return updateUser(values.id, {
          cname: values.cname,
        }).then(() => {
          tableRef.current?.reload();
        });
      }

      if (modal.type === ModalType.OTHER && values.id) {
        return resetpasswordUser(values.id, {
          password: values.password,
        }).then(() => {
          tableRef.current?.reload();
        });
      }
      return createUser({
        username: values.username,
        password: values.password,
        cname: values.cname,
        email: values.email,
      }).then(() => {
        tableRef.current?.reload();
      });
    },
  });

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'username',
      title: '用户名',
      render: (value, row) => {
        return (
          <>
            {value} {row.is_root && <Tag color="blue">超级管理员</Tag>}
          </>
        );
      },
    },
    {
      dataIndex: 'cname',
      title: '姓名',
    },
    {
      dataIndex: 'email',
      title: '邮箱',
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      width: 190,
      render: (_, row) => {
        return (
          <Space>
            <a
              onClick={() => {
                form.setFieldsValue(row);
                formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            {!row.is_root && (
              <a
                onClick={() => {
                  setRoleModal((state) => ({
                    ...state,
                    values: row.roles.map((item) => item.id.toString()) || [],
                    open: true,
                    user: row.id,
                  }));
                }}
              >
                变更角色
              </a>
            )}
            <a
              onClick={() => {
                form.setFieldsValue(row);
                formModalShow(ModalType.OTHER);
              }}
            >
              重置密码
            </a>
          </Space>
        );
      },
    },
  ];

  const submitRoleHandler = (roles: number[]) => {
    if (!roleModal.user) return;
    setRoleModal((state) => ({ ...state, loading: true }));

    updateRole(roleModal.user, { roles })
      .then(() => {
        message.success('权限修改成功');
        tableRef.current?.reload();
      })
      .finally(() => {
        setRoleModal((state) => ({ ...state, loading: false }));
      });
  };

  return (
    <>
      <ProTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        search={false}
        request={(params) => {
          return getUserList(transformPagination(params)).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        // headerTitle={
        //   <Input.Search
        //     value={searchParams.search_keywords}
        //     onChange={(e) => {
        //       setSearchParams((state) => ({
        //         ...state,
        //         search_keywords: e.target.value.trim(),
        //       }));
        //     }}
        //     style={{ width: 400 }}
        //     placeholder="请输入用户名搜索"
        //     enterButton={<>搜索</>}
        //     onSearch={() => {
        //       tableRef.current?.reload();
        //     }}
        //   />
        // }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              form.resetFields();
              formModalShow();
            }}
          >
            新增管理账户
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.open}
        title={formModal.type === ModalType.OTHER ? '重置密码' : `${formModalTitle}用户`}
        onCancel={formModalClose}
        onOk={submitHandler}
        okButtonProps={{
          loading: submitLoading,
        }}
      >
        <br />
        <Form form={form} labelCol={{ span: 4 }} initialValues={{ redundancy_count: 1 }}>
          {formModal.type !== ModalType.CREATE && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input disabled={formModal.type !== ModalType.CREATE} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input type="email" disabled={formModal.type !== ModalType.CREATE} />
          </Form.Item>
          <Form.Item name="cname" label="姓名" rules={[{ required: true }]}>
            <Input disabled={formModal.type === ModalType.OTHER} />
          </Form.Item>
          {(formModal.type === ModalType.CREATE || formModal.type === ModalType.OTHER) && (
            <>
              <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <ConfirmPasswordItem />
            </>
          )}
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        open={roleModal.open}
        title={`修改权限`}
        onCancel={() => {
          setRoleModal((state) => ({
            ...state,
            open: false,
          }));
        }}
        footer={false}
        okButtonProps={{
          loading: roleModal.loading,
        }}
        width={700}
      >
        <br />
        <Spin spinning={roleModal.loading}>
          <Transfer
            listStyle={{
              width: 300,
              height: 500,
            }}
            rowKey={(row) => row.id + ''}
            dataSource={roleList}
            titles={['未拥有', '已拥有']}
            targetKeys={roleModal.values}
            onChange={(values) => {
              setRoleModal((state) => ({
                ...state,
                values,
              }));
              submitRoleHandler(values.map(Number));
            }}
            render={(item) => item.name}
          />
        </Spin>
      </Modal>
    </>
  );
}
