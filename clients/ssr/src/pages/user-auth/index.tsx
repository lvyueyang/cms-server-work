import type { ReactNode } from "react";
import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

function AuthShell({
	title,
	action,
	children,
}: {
	title: string;
	action: {
		label: string;
		href: string;
	};
	children?: ReactNode;
}) {
	return (
		<MainLayout>
			<section className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col justify-center gap-6 px-6 py-10">
				<div className="space-y-2">
					<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
						Account
					</div>
					<h1 className="text-4xl font-black tracking-tight text-slate-900">
						{title}
					</h1>
				</div>
				<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
					{children}
					<a
						href={action.href}
						className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
					>
						{action.label}
					</a>
				</div>
			</section>
		</MainLayout>
	);
}

export function LoginPage({
	pageData,
}: PageComponentProps<{ message?: string }>) {
	return (
		<AuthShell title="登录" action={{ href: "/", label: "返回首页" }}>
			<p className="text-sm text-slate-600">
				请通过表单提交登录。
				{pageData.message ? `提示：${pageData.message}` : ""}
			</p>
		</AuthShell>
	);
}

export function RegisterPage() {
	return (
		<AuthShell
			title="注册"
			action={{ href: "/login", label: "已有账号，去登录" }}
		>
			<p className="text-sm text-slate-600">请通过表单提交注册信息。</p>
		</AuthShell>
	);
}

export function ResetPasswordPage() {
	return (
		<AuthShell title="重置密码" action={{ href: "/login", label: "返回登录" }}>
			<p className="text-sm text-slate-600">
				请通过表单提交手机号、验证码和新密码。
			</p>
		</AuthShell>
	);
}
