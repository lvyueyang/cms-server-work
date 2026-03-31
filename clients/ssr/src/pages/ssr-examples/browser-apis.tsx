import { SsrExamplesLab } from "../../components/SsrExamplesLab";
import type { PageComponentProps } from "../../runtime/types";
import { ExampleSectionHeader, SsrExampleLayout } from "./shared";

export interface SsrExamplesBrowserApisPageData {
	title: string;
	description: string;
	form_demo: {
		initial_draft: {
			name: string;
			email: string;
			notes: string;
		};
	};
	meta_demo: {
		title: string;
		description: string;
	};
	checklist: Array<{
		title: string;
		description: string;
	}>;
}

export function SsrExamplesBrowserApisPage({
	pageData,
	requestContext,
}: PageComponentProps<SsrExamplesBrowserApisPageData>) {
	return (
		<SsrExampleLayout
			title={pageData.title}
			desc={pageData.description}
			currentPath="/ssr-examples/browser-apis"
		>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-6">
				<ExampleSectionHeader
					eyebrow="BROWSER APIs"
					title="Hydration-only browser capabilities"
					desc="Everything here depends on the browser runtime. The SSR page only provides the initial serializable draft and request URL."
				/>
				<SsrExamplesLab
					initialDraft={pageData.form_demo.initial_draft}
					requestUrl={requestContext.req.originalUrl || requestContext.req.url}
					metaTitle={pageData.meta_demo.title}
					metaDescription={pageData.meta_demo.description}
				/>
				<div className="grid gap-4 md:grid-cols-3">
					{pageData.checklist.map((item) => (
						<div
							key={item.title}
							className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
						>
							<div className="text-lg font-bold text-slate-900">
								{item.title}
							</div>
							<div className="mt-2 text-sm text-slate-600">
								{item.description}
							</div>
						</div>
					))}
				</div>
			</section>
		</SsrExampleLayout>
	);
}
