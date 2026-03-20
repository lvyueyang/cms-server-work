import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

interface HomePageData {
	title?: string;
	banners?: Array<{
		id: number;
		title?: string;
		desc?: string;
		cover?: string;
		url?: string;
	}>;
	news?: {
		id: number;
		title?: string;
		desc?: string;
	};
}

export function HomePage({ pageData }: PageComponentProps<HomePageData>) {
	return (
		<MainLayout>
			<section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
							React SSR
						</div>
						<h1 className="text-5xl font-black tracking-tight text-slate-900">
							默认服务端渲染，按需挂载客户端组件
						</h1>
						<p className="max-w-2xl text-lg text-slate-600">
							页面内容由服务端流式输出，带 <code>'use client'</code> 的组件在浏览器端首次挂载。
						</p>
						<div className="flex flex-wrap gap-3 text-sm font-semibold">
							<a
								href="/ssr-examples"
								className="rounded-full bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700"
							>
								查看 SSR 示例套件
							</a>
							<a
								href="/ssr-examples/boundaries"
								className="rounded-full border border-slate-300 px-5 py-3 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
							>
								查看边界能力
							</a>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						{(pageData.banners ?? []).slice(0, 4).map((item) => (
							<a
								key={item.id}
								href={item.url || "#"}
								className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
							>
								<div className="text-lg font-bold text-slate-900">
									{item.title || "Banner"}
								</div>
								{item.desc ? (
									<div className="mt-2 text-sm text-slate-600">{item.desc}</div>
								) : null}
							</a>
						))}
					</div>
				</div>
				<div className="space-y-6">
					<a
						href="/ssr-examples"
						className="block rounded-[28px] border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
					>
						<div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
							SSR Demo Suite
						</div>
						<div className="mt-3 text-2xl font-black tracking-tight text-slate-900">
							多页面验证当前 SSR 的现有能力和边界能力
						</div>
						<div className="mt-3 text-sm text-slate-600">
							包含 i18n、资源引用、client islands、浏览器 API、错误边界和 meta 边界等专题页。
						</div>
					</a>
					{pageData.news ? (
						<a
							href={`/news/${pageData.news.id}`}
							className="block rounded-[28px] bg-slate-900 p-6 text-white shadow-lg"
						>
							<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
								Latest News
							</div>
							<div className="mt-3 text-2xl font-black tracking-tight">
								{pageData.news.title}
							</div>
							{pageData.news.desc ? (
								<div className="mt-2 text-sm text-slate-300">{pageData.news.desc}</div>
							) : null}
						</a>
					) : null}
				</div>
			</section>
		</MainLayout>
	);
}
