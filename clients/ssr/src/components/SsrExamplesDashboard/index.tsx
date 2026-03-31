"use client";

import {
	lazy,
	Suspense,
	startTransition,
	useCallback,
	useDeferredValue,
	useEffect,
	useState,
} from "react";
import { useCurrentUser } from "../../runtime/context";
import { useLang, useT } from "../../runtime/i18n";

const LazyMetricsPanel = lazy(() =>
	import("../LazyMetricsPanel/index.js").then((module) => ({
		default: module.LazyMetricsPanel,
	})),
);

interface DemoItem {
	id: number;
	name: string;
	category: "bundle" | "image" | "document";
	size_label: string;
	status: "ready" | "draft" | "archived";
}

interface MetricCard {
	id: string;
	title: string;
	value: string;
	trend: string;
}

interface SsrExamplesDashboardProps {
	initialItems: DemoItem[];
	metricCards: MetricCard[];
	assetPrefix: string;
}

function wait(ms: number) {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function SsrExamplesDashboard({
	initialItems,
	metricCards,
	assetPrefix,
}: SsrExamplesDashboardProps) {
	const t = useT();
	const lang = useLang();
	const currentUser = useCurrentUser();
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const [category, setCategory] = useState<DemoItem["category"] | "all">("all");
	const [items, setItems] = useState(initialItems);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [shouldLoadLazyPanel, setShouldLoadLazyPanel] = useState(false);

	const refreshItems = useCallback(
		async (shouldFail: boolean) => {
			setIsLoading(true);
			setError("");
			await wait(650);

			if (shouldFail) {
				startTransition(() => {
					setItems([]);
					setError(
						t(
							"ssr_examples.client.error",
							lang === "en-US"
								? "Mock request failed. Client-side retry is still available."
								: "模拟请求失败，但仍可在客户端重试。",
						),
					);
					setShouldLoadLazyPanel(false);
				});
				setIsLoading(false);
				return;
			}

			startTransition(() => {
				setItems(initialItems);
				setShouldLoadLazyPanel(true);
			});
			setIsLoading(false);
		},
		[initialItems, lang, t],
	);

	useEffect(() => {
		void refreshItems(false);
	}, [refreshItems]);

	const filteredItems = items.filter((item) => {
		if (category !== "all" && item.category !== category) {
			return false;
		}
		if (!deferredQuery.trim()) {
			return true;
		}
		return item.name.toLowerCase().includes(deferredQuery.trim().toLowerCase());
	});

	return (
		<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
						{t(
							"ssr_examples.client.badge",
							lang === "en-US" ? "Client Dashboard" : "客户端仪表盘",
						)}
					</div>
					<h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
						{t(
							"ssr_examples.client.title",
							lang === "en-US"
								? "Complex client component after mount"
								: "浏览器挂载后的复杂客户端组件",
						)}
					</h3>
					<p className="mt-2 max-w-3xl text-sm text-slate-600">
						{t(
							"ssr_examples.client.desc",
							lang === "en-US"
								? "This panel keeps local state, simulates async refresh, supports failure retry, and lazy-loads a secondary chunk."
								: "这个区块维护本地状态、模拟异步刷新、支持失败重试，并按需懒加载二级区块。",
						)}
					</p>
				</div>
				<div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
					<div className="font-semibold text-slate-900">
						{t(
							"ssr_examples.client.runtime",
							lang === "en-US" ? "Mounted runtime" : "挂载时环境",
						)}
					</div>
					<div className="mt-1">
						{t(
							"ssr_examples.client.runtime_lang",
							lang === "en-US" ? `Language: ${lang}` : `当前语言：${lang}`,
						)}
					</div>
					<div className="mt-1">
						{t(
							"ssr_examples.client.runtime_user",
							currentUser?.username
								? lang === "en-US"
									? `Current user: ${currentUser.username}`
									: `当前用户：${currentUser.username}`
								: lang === "en-US"
									? "Current user: guest"
									: "当前用户：访客",
						)}
					</div>
					<div className="mt-1 text-xs text-slate-500">
						assetPrefix: <code>{assetPrefix}</code>
					</div>
				</div>
			</div>

			<div className="mt-6 flex flex-wrap gap-3">
				<input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={
						lang === "en-US"
							? "Filter client data..."
							: "按名称筛选客户端数据..."
					}
					className="min-w-[220px] flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
				/>
				<select
					value={category}
					onChange={(event) =>
						setCategory(event.target.value as DemoItem["category"] | "all")
					}
					className="rounded-full border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
				>
					<option value="all">
						{lang === "en-US" ? "All assets" : "全部资源"}
					</option>
					<option value="bundle">
						{lang === "en-US" ? "Bundle" : "构建资源"}
					</option>
					<option value="image">
						{lang === "en-US" ? "Image" : "图片资源"}
					</option>
					<option value="document">
						{lang === "en-US" ? "Document" : "文档资源"}
					</option>
				</select>
				<button
					type="button"
					onClick={() => void refreshItems(false)}
					className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
				>
					{lang === "en-US" ? "Refresh success" : "刷新成功态"}
				</button>
				<button
					type="button"
					onClick={() => void refreshItems(true)}
					className="rounded-full border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-100"
				>
					{lang === "en-US" ? "Trigger error" : "触发错误态"}
				</button>
			</div>

			{isLoading ? (
				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={String(index)}
							className="h-28 animate-pulse rounded-[24px] bg-slate-100"
						/>
					))}
				</div>
			) : null}

			{error ? (
				<div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
					{error}
				</div>
			) : null}

			{!isLoading && !error ? (
				<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredItems.map((item) => (
						<article
							key={item.id}
							className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
						>
							<div className="flex items-center justify-between gap-3">
								<div className="text-base font-bold text-slate-900">
									{item.name}
								</div>
								<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
									{item.size_label}
								</span>
							</div>
							<div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
								<span className="rounded-full bg-white px-3 py-1">
									{item.category}
								</span>
								<span className="rounded-full bg-white px-3 py-1">
									{item.status}
								</span>
							</div>
						</article>
					))}
				</div>
			) : null}

			{!isLoading && !error && filteredItems.length === 0 ? (
				<div className="mt-6 rounded-[24px] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
					{lang === "en-US"
						? "No matching items after client-side filtering."
						: "客户端筛选后没有匹配的数据。"}
				</div>
			) : null}

			{query !== deferredQuery ? (
				<div className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
					{lang === "en-US"
						? "Applying deferred filter..."
						: "正在应用延迟筛选..."}
				</div>
			) : null}

			<div className="mt-6">
				{shouldLoadLazyPanel ? (
					<Suspense
						fallback={
							<div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
								{lang === "en-US"
									? "Loading lazy chunk in the browser..."
									: "浏览器端正在加载懒加载区块..."}
							</div>
						}
					>
						<LazyMetricsPanel cards={metricCards} />
					</Suspense>
				) : (
					<div className="rounded-[28px] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
						{lang === "en-US"
							? "Lazy panel waits for a successful client refresh."
							: "懒加载区块会在客户端刷新成功后再加载。"}
					</div>
				)}
			</div>
		</div>
	);
}
