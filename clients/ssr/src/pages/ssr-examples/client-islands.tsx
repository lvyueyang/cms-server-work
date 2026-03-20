import { SsrExamplesDashboard } from "../../components/SsrExamplesDashboard";
import type { PageComponentProps } from "../../runtime/types";
import { type DemoItem, type MetricCard, ExampleSectionHeader, SsrExampleLayout } from "./shared";

export interface SsrExamplesClientIslandsPageData {
	title: string;
	description: string;
	client_demo: {
		items: DemoItem[];
	};
	lazy_demo: {
		metric_cards: MetricCard[];
	};
	notes: Array<{
		title: string;
		description: string;
	}>;
}

export function SsrExamplesClientIslandsPage({
	pageData,
}: PageComponentProps<SsrExamplesClientIslandsPageData>) {
	return (
		<SsrExampleLayout
			title={pageData.title}
			desc={pageData.description}
			currentPath="/ssr-examples/client-islands"
		>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-6">
				<ExampleSectionHeader
					eyebrow="CLIENT ISLANDS"
					title="Browser-mounted islands with deferred updates"
					desc="This page isolates the current client component mechanism: placeholder mount, serializable props, deferred filtering, transitions, and lazy-loaded follow-up chunks."
				/>
				<SsrExamplesDashboard
					initialItems={pageData.client_demo.items}
					metricCards={pageData.lazy_demo.metric_cards}
					assetPrefix="/_fe_/"
				/>
				<div className="grid gap-4 md:grid-cols-3">
					{pageData.notes.map((item) => (
						<div
							key={item.title}
							className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
						>
							<div className="text-lg font-bold text-slate-900">{item.title}</div>
							<div className="mt-2 text-sm text-slate-600">{item.description}</div>
						</div>
					))}
				</div>
			</section>
		</SsrExampleLayout>
	);
}
