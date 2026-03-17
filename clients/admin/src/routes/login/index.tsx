import { UserAdminLoginBody } from "@cms/api-interface";
import { Link, redirect, useNavigate, createFileRoute } from '@tanstack/react-router';
import { Button, Form, Input, Row, Space } from "antd";
import { useState } from "react";
import LoginContainer from "@/components/LoginContainer";
import { TOKEN_KEY } from "@/constants";
import { useConsumeLocationState } from "@/hooks/useConsumeLocationState";
import { getAuthToken } from "@/router/auth";
import { useUserinfoStore } from "@/store/userinfo";
import { message } from "@/utils/notice";
import { login } from "./modules";

type LoginBody = UserAdminLoginBody;

function Login() {
	const [form] = Form.useForm<LoginBody>();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { load: loadUser } = useUserinfoStore();
	const submitHandler = async (formValue: LoginBody) => {
		setLoading(true);
		login(formValue)
			.then(({ data }) => {
				localStorage.setItem(TOKEN_KEY, data.data.token);
				message.success("登录成功");
				loadUser?.();
				navigate({ to: "/" });
			})
			.finally(() => {
				setLoading(false);
			});
	};
	useConsumeLocationState<Pick<LoginBody, "username" | "password">>({
		select: (state) => {
			const { username, password } = (state || {}) as Record<string, any>;
			if (!username || !password) return undefined;
			return { username, password };
		},
		onConsume: (value) => {
			form.setFieldsValue(value);
		},
		clear: () => ({
			to: "/login",
		}),
	});
	return (
		<LoginContainer>
			<h3>
				<b>请登录</b>
			</h3>
			<br />
			<Form<LoginBody>
				colon={false}
				onFinish={submitHandler}
				style={{ width: 280 }}
				form={form}
			>
				<Form.Item
					name="username"
					rules={[{ required: true, message: "请输入用户名" }]}
				>
					<Input placeholder="请输入用户名/邮箱" autoComplete="off" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: "请输入密码" }]}
				>
					<Input.Password placeholder="请输入您的密码" autoComplete="off" />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						登陆
					</Button>
				</Form.Item>
				<Row justify="end" style={{ marginTop: -10 }}>
					<Space size={20}>
						<Link to="/nopassword">找回密码</Link>
						{/* <Link to="/register">注册</Link> */}
					</Space>
				</Row>
			</Form>
		</LoginContainer>
	);
}

export const Route = createFileRoute('/login/')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: () => {
    if (getAuthToken()) {
      throw redirect({ to: '/' });
    }
  },
  component: Login,
});
