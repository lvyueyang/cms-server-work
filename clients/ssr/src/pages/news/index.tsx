import { Count } from "../../components/Count";
import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

interface NewsItem {
	id: number;
	title: string;
	desc?: string;
}

interface NewsListPageData {
	title?: string;
	dataList: NewsItem[];
	prev: number;
	next: number;
}

interface NewsDetailPageData {
	title?: string;
	info?: {
		id: number;
		title?: string;
		desc?: string;
		content?: string;
	};
	next?: {
		id: number;
		title: string;
	};
	prev?: {
		id: number;
		title: string;
	};
}

export function NewsListPage({
	pageData,
}: PageComponentProps<NewsListPageData>) {
	return (
		<MainLayout>
			<section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.8fr_1.2fr]">
				<div className="space-y-4">
					<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
						News
					</div>
					<h1 className="text-5xl font-black tracking-tight text-slate-900">
						新闻列表
					</h1>
					<p className="text-base text-slate-600">
						这个页面由服务端直接输出，右侧计数器来自 <code>'use client'</code>{" "}
						组件。
					</p>
					<Count />
				</div>
				<div className="space-y-4">
					{pageData.dataList.map((item) => (
						<a
							key={item.id}
							href={`/news/${item.id}`}
							className="block rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
						>
							<div className="text-2xl font-black tracking-tight text-slate-900">
								{item.title}
							</div>
							{item.desc ? (
								<div className="mt-2 text-sm text-slate-600">{item.desc}</div>
							) : null}
						</a>
					))}
					<div className="flex gap-3">
						{pageData.prev ? (
							<a
								href={`/news?current=${pageData.prev}`}
								className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
							>
								上一页
							</a>
						) : null}
						{pageData.next ? (
							<a
								href={`/news?current=${pageData.next}`}
								className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
							>
								下一页
							</a>
						) : null}
					</div>
				</div>
			</section>
		</MainLayout>
	);
}

export function NewsDetailPage({
	pageData,
}: PageComponentProps<NewsDetailPageData>) {
	return (
		<MainLayout>
			<article className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
				<h1 className="text-4xl font-black tracking-tight text-slate-900">
					{pageData.info?.title ?? "新闻详情"}
				</h1>
				{pageData.info?.desc ? (
					<p className="text-lg text-slate-600">{pageData.info.desc}</p>
				) : null}
				<div
					className="prose prose-slate max-w-none"
					dangerouslySetInnerHTML={{ __html: pageData.info?.content ?? "" }}
				/>
				<div className="flex gap-4 text-sm font-semibold">
					{pageData.prev ? (
						<a href={`/news/${pageData.prev.id}`}>
							上一篇：{pageData.prev.title}
						</a>
					) : null}
					{pageData.next ? (
						<a href={`/news/${pageData.next.id}`}>
							下一篇：{pageData.next.title}
						</a>
					) : null}
				</div>
			</article>
		</MainLayout>
	);
}
