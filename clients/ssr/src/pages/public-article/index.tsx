import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

interface PublicArticlePageData {
	title?: string;
	content?: string;
	desc?: string;
}

export function PublicArticleDetailPage({
	pageData,
}: PageComponentProps<PublicArticlePageData>) {
	return (
		<MainLayout>
			<article className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
				<h1 className="text-4xl font-black tracking-tight text-slate-900">
					{pageData.title ?? "Article"}
				</h1>
				{pageData.desc ? (
					<p className="text-lg text-slate-600">{pageData.desc}</p>
				) : null}
				<div
					className="prose prose-slate max-w-none"
					dangerouslySetInnerHTML={{ __html: pageData.content ?? "" }}
				/>
			</article>
		</MainLayout>
	);
}
