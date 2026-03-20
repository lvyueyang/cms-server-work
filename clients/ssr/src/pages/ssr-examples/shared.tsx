import type { ReactNode } from "react";
import { MainLayout } from "../../layouts/main";
import { useGlobalData } from "../../runtime/context";
import { useLang } from "../../runtime/i18n";

export interface ExampleResourceLink {
	label: string;
	href: string;
	description: string;
}

export interface DemoItem {
	id: number;
	name: string;
	category: "bundle" | "image" | "document";
	size_label: string;
	status: "ready" | "draft" | "archived";
}

export interface MetricCard {
	id: string;
	title: string;
	value: string;
	trend: string;
}

export interface ExampleNavItem {
	label: string;
	href: string;
	description: string;
}

export const SSR_EXAMPLE_NAV: ExampleNavItem[] = [
	{
		label: "Overview",
		href: "/ssr-examples",
		description: "总览与路由矩阵",
	},
	{
		label: "I18n",
		href: "/ssr-examples/i18n",
		description: "服务端与客户端共享国际化上下文",
	},
	{
		label: "Assets",
		href: "/ssr-examples/assets",
		description: "静态资源、manifest 与路径分层",
	},
	{
		label: "Client Islands",
		href: "/ssr-examples/client-islands",
		description: "复杂 use client 组件、deferred filter、lazy chunk",
	},
	{
		label: "Browser APIs",
		href: "/ssr-examples/browser-apis",
		description: "表单、localStorage、navigator、clipboard",
	},
	{
		label: "Boundaries",
		href: "/ssr-examples/boundaries",
		description: "错误边界、meta 边界与不支持项",
	},
];

export function ExampleSectionHeader({
	eyebrow,
	title,
	desc,
}: {
	eyebrow: string;
	title: string;
	desc: string;
}) {
	return (
		<div className="space-y-2">
			<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
				{eyebrow}
			</div>
			<h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
			<p className="max-w-3xl text-base text-slate-600">{desc}</p>
		</div>
	);
}

export function SsrExampleLayout({
	title,
	desc,
	currentPath,
	children,
}: {
	title: string;
	desc: string;
	currentPath: string;
	children: ReactNode;
}) {
	const lang = useLang();
	const globalData = useGlobalData();

	return (
		<MainLayout>
			<section className="mx-auto max-w-6xl px-6 py-10">
				<div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
					<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
							SSR Example Suite
						</div>
						<h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
							{title}
						</h1>
						<p className="mt-3 text-base text-slate-600">{desc}</p>
						<div className="mt-6 space-y-3">
							{SSR_EXAMPLE_NAV.map((item) => {
								const isActive = item.href === currentPath;
								return (
									<a
										key={item.href}
										href={item.href}
										className={`block rounded-[24px] border p-4 transition ${
											isActive
												? "border-slate-900 bg-slate-900 text-white"
												: "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
										}`}
									>
										<div
											className={`text-lg font-bold ${
												isActive ? "text-white" : "text-slate-900"
											}`}
										>
											{item.label}
										</div>
										<div
											className={`mt-1 text-sm ${
												isActive ? "text-slate-200" : "text-slate-600"
											}`}
										>
											{item.description}
										</div>
									</a>
								);
							})}
						</div>
					</div>
					<div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
							Runtime Snapshot
						</div>
						<div className="mt-4 grid gap-4 sm:grid-cols-2">
							<div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
								<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
									lang
								</div>
								<div className="mt-2 text-2xl font-black">{lang}</div>
							</div>
							<div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
								<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
									i18n enabled
								</div>
								<div className="mt-2 text-2xl font-black">
									{globalData.i18n_enabled ? "true" : "false"}
								</div>
							</div>
							<div className="rounded-[24px] border border-white/10 bg-white/5 p-4 sm:col-span-2">
								<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
									company email
								</div>
								<div className="mt-2 break-all text-sm font-semibold text-slate-100">
									{globalData.company_email || "N/A"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{children}
		</MainLayout>
	);
}
