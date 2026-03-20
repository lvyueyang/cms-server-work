import type { PageComponentProps } from "../../runtime/types";
import {
	type DemoItem,
	type ExampleNavItem,
	type ExampleResourceLink,
	type MetricCard,
	ExampleSectionHeader,
	SsrExampleLayout,
} from "./shared";

export interface SsrExamplesPageData {
	title: string;
	description: string;
	hero: {
		eyebrow: string;
		title: string;
		desc: string;
	};
	route_cards: ExampleNavItem[];
	capability_cards: Array<{
		title: string;
		description: string;
		status: string;
	}>;
	i18n_demo: {
		server_title_key: string;
		server_title_fallback: string;
		server_body_key: string;
		server_body_fallback: string;
		switch_links: Array<{
			label: string;
			href: string;
		}>;
	};
	asset_demo: {
		asset_prefix: string;
		logo_alt: string;
		resource_links: ExampleResourceLink[];
	};
	client_demo: {
		items: DemoItem[];
	};
	lazy_demo: {
		metric_cards: MetricCard[];
	};
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
}

export function SsrExamplesPage({
	pageData,
	t,
}: PageComponentProps<SsrExamplesPageData>) {
	return (
		<SsrExampleLayout
			title={pageData.title}
			desc={pageData.description}
			currentPath="/ssr-examples"
		>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-4">
				<ExampleSectionHeader
					eyebrow={pageData.hero.eyebrow}
					title={pageData.hero.title}
					desc={pageData.hero.desc}
				/>
				<div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
							Route Matrix
						</div>
						<div className="mt-5 grid gap-4">
							{pageData.route_cards.map((item) => (
								<a
									key={item.href}
									href={item.href}
									className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
								>
									<div className="text-lg font-bold text-slate-900">{item.label}</div>
									<div className="mt-1 text-sm font-semibold text-slate-500">
										{item.href}
									</div>
									<div className="mt-2 text-sm text-slate-600">{item.description}</div>
								</a>
							))}
						</div>
					</div>
					<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
							Capability Matrix
						</div>
						<div className="mt-5 grid gap-4">
							{pageData.capability_cards.map((item) => (
								<div
									key={item.title}
									className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
								>
									<div className="flex items-center justify-between gap-3">
										<div className="text-lg font-bold text-slate-900">
											{item.title}
										</div>
										<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
											{item.status}
										</span>
									</div>
									<div className="mt-2 text-sm text-slate-600">{item.description}</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="rounded-[32px] border border-emerald-200 bg-emerald-50/80 p-6 text-sm text-emerald-900 shadow-sm">
					<div className="font-semibold">
						{t(
							pageData.i18n_demo.server_title_key,
							pageData.i18n_demo.server_title_fallback,
						)}
					</div>
					<div className="mt-2">
						{t(
							pageData.i18n_demo.server_body_key,
							pageData.i18n_demo.server_body_fallback,
						)}
					</div>
				</div>
			</section>
		</SsrExampleLayout>
	);
}
