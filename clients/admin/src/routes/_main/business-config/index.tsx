import { ActionType, ProColumns } from "@ant-design/pro-components";
import {
	BusinessConfigCreateDto,
	BusinessConfigInfo,
	BusinessConfigUpdateDto,
} from "@cms/api-interface";
import { createFileRoute } from "@tanstack/react-router";
import {
	Button,
	Form,
	Input,
	Modal,
	Popconfirm,
	Select,
	Space,
	Switch,
} from "antd";
import { useRef, useState } from "react";
import { AutoContentInput } from "@/components/AutoContentInput";
import { AvailableSwitch } from "@/components/Available";
import PageTable from "@/components/PageTable";
import { ContentType, ContentTypeMap } from "@/constants";
import { ModalType, useFormModal } from "@/hooks/useFormModal";
import {
	contentType2Label,
	createI18nColumn,
	enumMapToOptions,
	transformPagination,
	transformSort,
} from "@/utils";
import { message } from "@/utils/notice";
import { createApi, getListApi, removeApi, updateApi } from "./module";

type TableItem = BusinessConfigInfo;
type CreateFormValues = BusinessConfigCreateDto;
type UpdateFormValues = BusinessConfigUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>("business_config");

export default function BusinessConfigPage() {
	const [searchForm, setSearchForm] = useState({
		keyword: "",
	});
	const tableRef = useRef<ActionType | undefined>(undefined);
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
		{
			dataIndex: "code",
			title: "编码",
			width: 120,
		},
		i18nColumn({
			dataIndex: "title",
			title: "名称",
			sorter: true,
			width: 160,
		}),
		{
			dataIndex: "is_available",
			title: "是否可用",
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
		{
			dataIndex: "content_type",
			title: "内容类型",
			width: 60,
			render: (_, row) => {
				return contentType2Label(row.content_type);
			},
		},
		{
			dataIndex: "content",
			title: "内容",
			width: 50,
			ellipsis: true,
			render: (_, row) => {
				return (
					<i18nColumn.I18nBlock
						dataIndex="content"
						row={row!}
						transType={row.content_type as ContentType}
						hideValue
						val={row.content}
					/>
				);
			},
		},
		{
			dataIndex: "create_date",
			title: "创建时间",
			valueType: "dateTime",
			width: 180,
			sorter: true,
		},
		{
			dataIndex: "update_date",
			title: "修改时间",
			valueType: "dateTime",
			sorter: true,
			width: 180,
		},
		{
			dataIndex: "operate",
			title: "操作",
			hideInSearch: true,
			fixed: "right",
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
							title="确定要删除这个业务配置吗？"
							onConfirm={() => {
								const close = message.loading("删除中...", 0);
								removeApi(row.id)
									.then(() => {
										message.success("删除成功");
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
				scroll={{ x: 1400 }}
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
						placeholder="请输入业务配置名称搜索"
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
							formModal.form.resetFields();
							formModal.formModalShow();
						}}
					>
						新增
					</Button>,
				]}
			/>
			<Modal
				maskClosable={false}
				keyboard={false}
				open={formModal.formModal.open}
				title={`${formModal.formModalTitle}业务配置`}
				onCancel={formModal.formModalClose}
				onOk={formModal.submitHandler}
				okButtonProps={{
					loading: formModal.submitLoading,
				}}
				width={800}
			>
				<br />
				<Form
					form={formModal.form}
					labelCol={{ span: 4 }}
					initialValues={{ redundancy_count: 1 }}
				>
					{formModal.formModal.type !== ModalType.CREATE && (
						<Form.Item label="ID" name="id" hidden>
							<Input disabled />
						</Form.Item>
					)}
					<Form.Item label="编码" name="code" rules={[{ required: true }]}>
						<Input
							style={{ width: 200 }}
							disabled={formModal.formModal.type !== ModalType.CREATE}
						/>
					</Form.Item>
					<Form.Item label="标题" name="title" rules={[{ required: true }]}>
						<Input style={{ width: 200 }} />
					</Form.Item>
					<Form.Item label="内容类型" name="content_type">
						<Select
							options={enumMapToOptions(ContentTypeMap)}
							allowClear
							style={{ width: 200 }}
						/>
					</Form.Item>
					<Form.Item
						label="上架状态"
						name="is_available"
						valuePropName="checked"
					>
						<Switch checkedChildren="上架" unCheckedChildren="下架" />
					</Form.Item>

					<Form.Item label="内容" dependencies={["content_type"]}>
						{() => {
							const contentType = formModal.form.getFieldValue("content_type");
							return (
								<Form.Item noStyle name="content">
									<AutoContentInput type={contentType} />
								</Form.Item>
							);
						}}
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export const Route = createFileRoute("/_main/business-config/")({
	component: BusinessConfigPage,
});
