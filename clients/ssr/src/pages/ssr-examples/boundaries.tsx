import type { PageComponentProps } from "../../runtime/types";
import { ExampleSectionHeader, SsrExampleLayout } from "./shared";

export interface SsrExamplesBoundariesPageData {
	title: string;
	description: string;
	supported: Array<{
		title: string;
		description: string;
	}>;
	boundaries: Array<{
		title: string;
		description: string;
		status: string;
	}>;
	meta: {
		title: string;
		description: string;
	};
}

export function SsrExamplesBoundariesPage({
	pageData,
	requestContext,
}: PageComponentProps<SsrExamplesBoundariesPageData>) {
	return (
		<SsrExampleLayout
			title={pageData.title}
			desc={pageData.description}
			currentPath="/ssr-examples/boundaries"
		>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-6">
				<ExampleSectionHeader
					eyebrow="BOUNDARIES"
					title="Current support boundaries of this SSR runtime"
					desc="This page is intentionally light on interaction and focuses on the rules implementers should not violate."
				/>
				<div className="grid gap-5 lg:grid-cols-2">
					<div className="rounded-[32px] border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
							supported now
						</div>
						<div className="mt-5 grid gap-4">
							{pageData.supported.map((item) => (
								<div
									key={item.title}
									className="rounded-[24px] border border-white/80 bg-white p-4"
								>
									<div className="text-lg font-bold text-slate-900">{item.title}</div>
									<div className="mt-2 text-sm text-slate-600">{item.description}</div>
								</div>
							))}
						</div>
					</div>
					<div className="rounded-[32px] border border-rose-200 bg-rose-50/80 p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-700">
							boundaries
						</div>
						<div className="mt-5 grid gap-4">
							{pageData.boundaries.map((item) => (
								<div
									key={item.title}
									className="rounded-[24px] border border-white/80 bg-white p-4"
								>
									<div className="flex items-center justify-between gap-3">
										<div className="text-lg font-bold text-slate-900">{item.title}</div>
										<span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
											{item.status}
										</span>
									</div>
									<div className="mt-2 text-sm text-slate-600">{item.description}</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
					<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
							meta today
						</div>
						<div className="mt-4 text-sm text-slate-600">
							Current route: {requestContext.req.originalUrl || requestContext.req.url}
						</div>
						<div className="mt-5 grid gap-4">
							<div className="rounded-[24px] bg-slate-50 p-4">
								<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
									title
								</div>
								<div className="mt-2 text-lg font-bold text-slate-900">
									{pageData.meta.title}
								</div>
							</div>
							<div className="rounded-[24px] bg-slate-50 p-4">
								<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
									description
								</div>
								<div className="mt-2 text-sm text-slate-600">
									{pageData.meta.description}
								</div>
							</div>
						</div>
					</div>
					<div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
							quick links
						</div>
						<div className="mt-5 grid gap-4">
							<a
								href="/404"
								className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
							>
								Test 404 Page
							</a>
							<a
								href="/500"
								className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
							>
								Test 500 Page
							</a>
							<a
								href="/ssr-examples/browser-apis"
								className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
							>
								Test Client Error Boundary
							</a>
						</div>
					</div>
				</div>
			</section>
		</SsrExampleLayout>
	);
}
