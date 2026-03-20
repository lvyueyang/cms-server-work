import { useLang, useT } from "../../runtime/i18n";

interface MetricCard {
	id: string;
	title: string;
	value: string;
	trend: string;
}

export function LazyMetricsPanel({ cards }: { cards: MetricCard[] }) {
	const t = useT();
	const lang = useLang();

	return (
		<div className="rounded-[28px] border border-emerald-200 bg-emerald-50/80 p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
						{t(
							"ssr_examples.lazy_panel.badge",
							lang === "en-US" ? "Lazy Loaded Chunk" : "懒加载区块",
						)}
					</div>
					<h3 className="mt-2 text-2xl font-black tracking-tight text-emerald-950">
						{t(
							"ssr_examples.lazy_panel.title",
							lang === "en-US"
								? "Loaded after client mount"
								: "浏览器挂载后再按需加载",
						)}
					</h3>
				</div>
				<div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
					{t(
						"ssr_examples.lazy_panel.hint",
						lang === "en-US"
							? "Rendered via React.lazy + Suspense"
							: "通过 React.lazy + Suspense 渲染",
					)}
				</div>
			</div>
			<div className="mt-5 grid gap-4 md:grid-cols-3">
				{cards.map((card) => (
					<div
						key={card.id}
						className="rounded-[24px] border border-white/80 bg-white p-4 shadow-sm"
					>
						<div className="text-sm font-semibold text-slate-500">{card.title}</div>
						<div className="mt-2 text-3xl font-black tracking-tight text-slate-900">
							{card.value}
						</div>
						<div className="mt-2 text-sm font-semibold text-emerald-700">
							{card.trend}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
