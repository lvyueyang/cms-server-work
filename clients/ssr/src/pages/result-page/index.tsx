import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

type ResultType = "user_register" | "back" | "user_login";

interface ResultPageData {
	title?: string;
	status?: "success" | "error" | "warning";
	description?: string;
	type?: ResultType;
}

const typeConfig: Record<ResultType, { href: string; label: string }> = {
	user_register: {
		href: "/register",
		label: "去注册",
	},
	back: {
		href: "javascript:history.back()",
		label: "返回上一页",
	},
	user_login: {
		href: "/login",
		label: "去登录",
	},
};

export function ResultPage({
	pageData,
}: PageComponentProps<ResultPageData>) {
	const action = pageData.type ? typeConfig[pageData.type] : null;
	const toneClass =
		pageData.status === "success"
			? "bg-emerald-500"
			: pageData.status === "warning"
				? "bg-amber-500"
				: "bg-rose-500";

	return (
		<MainLayout>
			<section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-5 px-6 text-center">
				<div className={`h-4 w-24 rounded-full ${toneClass}`} />
				<h1 className="text-4xl font-black tracking-tight text-slate-900">
					{pageData.title ?? "结果"}
				</h1>
				{pageData.description ? (
					<p className="text-base text-slate-600">{pageData.description}</p>
				) : null}
				{action ? (
					<a
						href={action.href}
						className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
					>
						{action.label}
					</a>
				) : null}
			</section>
		</MainLayout>
	);
}
