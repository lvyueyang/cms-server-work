import type { NewsCreateDto, NewsUpdateDto } from "@cms/api-interface";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useRequest } from "ahooks";
import { Button, Card, DatePicker, Form, Input, Row, Switch } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { LowCodeEditor } from "@/components/LowcodeEditor";
import { RecommendFormItem } from "@/components/RecommendFormItem";
import UploadImage from "@/components/UploadImage";
import { message } from "@/utils/notice";
import { createApi, getDetailApi, updateApi } from "./services";

type FormValues = Omit<NewsCreateDto, "push_date"> &
	Partial<Pick<NewsUpdateDto, "id">> & {
		push_date?: Dayjs;
	};

export default function NewsFormPage() {
	const { id } = useParams({ strict: false }) as { id?: string };
	const isUpdate = !!id;
	const [form] = Form.useForm<FormValues>();
	const navigate = useNavigate();
	const { run: submitHandler, loading } = useRequest(
		async () => {
			const values = form.getFieldsValue();
			const payload = {
				...values,
				...(values.push_date
					? { push_date: dayjs(values.push_date).format("YYYY-MM-DD HH:mm") }
					: void 0),
			};

			if (isUpdate) {
				await updateApi(payload as NewsUpdateDto);
				message.success("更新成功");
				return;
			}

			await createApi(payload as NewsCreateDto);
			navigate({ to: "/news/list" });
			message.success("创建成功");
		},
		{ manual: true },
	);

	useEffect(() => {
		if (!id) return;
		getDetailApi(Number(id)).then((res) => {
			form.setFieldsValue({
				...res.data.data,
				push_date: res.data.data.push_date
					? dayjs(res.data.data.push_date)
					: void 0,
			});
		});
	}, [form, id]);

	return (
		<Card style={{ maxWidth: 1000, margin: "0 auto" }}>
			<Form<FormValues>
				form={form}
				onFinish={submitHandler}
				labelCol={{ flex: "100px" }}
			>
				<Form.Item label="新闻ID" name="id" hidden={!id}>
					<Input disabled />
				</Form.Item>
				<Form.Item label="新闻标题" name="title" rules={[{ required: true }]}>
					<Input placeholder="请输入" />
				</Form.Item>
				<Form.Item label="是否上架" name="is_available" valuePropName="checked">
					<Switch checkedChildren="上架" unCheckedChildren="下架" />
				</Form.Item>
				<Form.Item
					label="新闻封面"
					name="cover"
					rules={[{ required: true, message: "请上传新闻封面" }]}
				>
					<UploadImage />
				</Form.Item>
				<Form.Item label="发布日期" name="push_date">
					<DatePicker format="YYYY-MM-DD HH:mm" showTime />
				</Form.Item>
				<RecommendFormItem />
				<Form.Item label="新闻描述" name="desc">
					<Input.TextArea placeholder="可选输入" />
				</Form.Item>
				<Form.Item
					label="新闻详情"
					name="content"
					rules={[{ required: true, validateTrigger: "submit" }]}
				>
					<LowCodeEditor />
				</Form.Item>
				<Form.Item label=" ">
					<Row justify="center">
						<Button
							style={{ width: 160 }}
							type="primary"
							htmlType="submit"
							loading={loading}
						>
							提交
						</Button>
					</Row>
				</Form.Item>
			</Form>
		</Card>
	);
}
