import { useLang, useT } from "../../runtime/i18n";
import type { PageComponentProps } from "../../runtime/types";
import { ExampleSectionHeader, SsrExampleLayout } from "./shared";

export interface SsrExamplesI18nPageData {
	title: string;
	description: string;
	server_copy: {
		title_key: string;
		title_fallback: string;
		body_key: string;
		body_fallback: string;
	};
	switch_links: Array<{
		label: string;
		href: string;
	}>;
	debug: Array<{
		label: string;
		value: string;
	}>;
}

function I18nClientMirror() {
	const t = useT();
	const lang = useLang();

	return (
		<div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
			<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
				client hooks
			</div>
			<h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
				{t(
					"ssr_examples.i18n.client_title",
					lang === "en-US" ? "Client hook mirror" : "客户端 hook 镜像",
				)}
			</h3>
			<div className="mt-3 text-sm text-slate-600">
				{t(
					"ssr_examples.i18n.client_body",
					lang === "en-US"
						? `useLang() reports ${lang} after hydration.`
						: `hydration 之后 useLang() 会返回 ${lang}。`,
				)}
			</div>
		</div>
	);
}

export function SsrExamplesI18nPage({
	pageData,
	t,
}: PageComponentProps<SsrExamplesI18nPageData>) {
	return (
		<SsrExampleLayout
			title={pageData.title}
			desc={pageData.description}
			currentPath="/ssr-examples/i18n"
		>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-6">
				<ExampleSectionHeader
					eyebrow="I18N"
					title={t(
						pageData.server_copy.title_key,
						pageData.server_copy.title_fallback,
					)}
					desc={t(
						pageData.server_copy.body_key,
						pageData.server_copy.body_fallback,
					)}
				/>
				<div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
					<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
						<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
							switch language
						</div>
						<div className="mt-5 flex flex-wrap gap-3">
							{pageData.switch_links.map((item) => (
								<a
									key={item.href}
									href={item.href}
									className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
								>
									{item.label}
								</a>
							))}
						</div>
						<div className="mt-5 rounded-[24px] border border-dashed border-slate-300 p-4 text-sm text-slate-600">
							Language switch keeps using the existing `/en/*` and `/zh/*`
							redirect flow on the server.
						</div>
					</div>
					<I18nClientMirror />
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{pageData.debug.map((item) => (
						<div
							key={item.label}
							className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
						>
							<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
								{item.label}
							</div>
							<div className="mt-2 break-all text-sm font-semibold text-slate-900">
								{item.value}
							</div>
						</div>
					))}
				</div>
			</section>
		</SsrExampleLayout>
	);
}
