"use client";

import {
	Component,
	type ErrorInfo,
	startTransition,
	useEffect,
	useState,
} from "react";
import { useLang, useT } from "../../runtime/i18n";

const STORAGE_KEY = "cms:ssr-examples:form";

interface FormDraft {
	name: string;
	email: string;
	notes: string;
}

interface BrowserInfo {
	language: string;
	userAgent: string;
	currentHref: string;
}

interface SsrExamplesLabProps {
	initialDraft: FormDraft;
	requestUrl: string;
	metaTitle: string;
	metaDescription: string;
}

class ClientErrorBoundary extends Component<
	{
		children: React.ReactNode;
		fallbackTitle: string;
		fallbackMessage: string;
	},
	{ hasError: boolean }
> {
	constructor(props: {
		children: React.ReactNode;
		fallbackTitle: string;
		fallbackMessage: string;
	}) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {}

	reset = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
					<div className="font-semibold">{this.props.fallbackTitle}</div>
					<div className="mt-2">{this.props.fallbackMessage}</div>
					<button
						type="button"
						onClick={this.reset}
						className="mt-4 rounded-full border border-rose-300 px-4 py-2 font-semibold transition hover:border-rose-500"
					>
						Reset boundary
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}

function CrashProbe({ shouldCrash }: { shouldCrash: boolean }) {
	if (shouldCrash) {
		throw new Error("SsrExamplesLab crash probe");
	}
	return (
		<div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
			Error boundary is armed but currently healthy.
		</div>
	);
}

function wait(ms: number) {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function SsrExamplesLab({
	initialDraft,
	requestUrl,
	metaTitle,
	metaDescription,
}: SsrExamplesLabProps) {
	const t = useT();
	const lang = useLang();
	const [draft, setDraft] = useState<FormDraft>(initialDraft);
	const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
	const [submitMessage, setSubmitMessage] = useState("");
	const [copyMessage, setCopyMessage] = useState("");
	const [shouldCrash, setShouldCrash] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		try {
			const cached = window.localStorage.getItem(STORAGE_KEY);
			if (cached) {
				const parsed = JSON.parse(cached) as Partial<FormDraft>;
				setDraft({
					name:
						typeof parsed.name === "string" ? parsed.name : initialDraft.name,
					email:
						typeof parsed.email === "string"
							? parsed.email
							: initialDraft.email,
					notes:
						typeof parsed.notes === "string"
							? parsed.notes
							: initialDraft.notes,
				});
			}
		} catch {}

		setBrowserInfo({
			language: window.navigator.language,
			userAgent: window.navigator.userAgent,
			currentHref: window.location.href,
		});
	}, [initialDraft.email, initialDraft.name, initialDraft.notes]);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
		} catch {}
	}, [draft]);

	async function handleSubmit() {
		setIsSubmitting(true);
		await wait(550);
		startTransition(() => {
			setSubmitMessage(
				t(
					"ssr_examples.lab.submit",
					lang === "en-US"
						? `Saved draft for ${draft.name || "anonymous visitor"}.`
						: `已保存 ${draft.name || "匿名访客"} 的示例草稿。`,
				),
			);
			setIsSubmitting(false);
		});
	}

	async function handleCopy() {
		const target = browserInfo?.currentHref || requestUrl;
		try {
			await window.navigator.clipboard.writeText(target);
			setCopyMessage(
				lang === "en-US"
					? "Current URL copied via Clipboard API."
					: "已通过 Clipboard API 复制当前 URL。",
			);
		} catch {
			setCopyMessage(
				lang === "en-US"
					? "Clipboard API unavailable in this browser."
					: "当前浏览器不可用 Clipboard API。",
			);
		}
	}

	return (
		<div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
			<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
				<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
					{lang === "en-US" ? "Form + Browser APIs" : "表单 + 浏览器 API"}
				</div>
				<h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
					{lang === "en-US"
						? "Client form state after hydration"
						: "挂载后的客户端表单状态"}
				</h3>
				<p className="mt-2 text-sm text-slate-600">
					{lang === "en-US"
						? "This form persists draft state into localStorage, reads navigator information after mount, and uses the Clipboard API to copy the current route."
						: "这个表单会把草稿状态写入 localStorage，在挂载后读取 navigator 信息，并通过 Clipboard API 复制当前路由。"}
				</p>

				<div className="mt-6 grid gap-4">
					<input
						value={draft.name}
						onChange={(event) =>
							setDraft((prev) => ({ ...prev, name: event.target.value }))
						}
						placeholder={lang === "en-US" ? "Name" : "姓名"}
						className="rounded-[20px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
					/>
					<input
						value={draft.email}
						onChange={(event) =>
							setDraft((prev) => ({ ...prev, email: event.target.value }))
						}
						placeholder={lang === "en-US" ? "Email" : "邮箱"}
						className="rounded-[20px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
					/>
					<textarea
						value={draft.notes}
						onChange={(event) =>
							setDraft((prev) => ({ ...prev, notes: event.target.value }))
						}
						placeholder={
							lang === "en-US"
								? "Notes for hydration demo"
								: "输入一些用于 hydration 演示的备注"
						}
						rows={5}
						className="rounded-[20px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
					/>
				</div>

				<div className="mt-5 flex flex-wrap gap-3">
					<button
						type="button"
						onClick={() => void handleSubmit()}
						className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
					>
						{isSubmitting
							? lang === "en-US"
								? "Submitting..."
								: "提交中..."
							: lang === "en-US"
								? "Mock submit"
								: "模拟提交"}
					</button>
					<button
						type="button"
						onClick={() => void handleCopy()}
						className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
					>
						{lang === "en-US" ? "Copy current URL" : "复制当前 URL"}
					</button>
				</div>

				{submitMessage ? (
					<div className="mt-4 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
						{submitMessage}
					</div>
				) : null}
				{copyMessage ? (
					<div className="mt-4 rounded-[20px] border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
						{copyMessage}
					</div>
				) : null}
			</div>

			<div className="space-y-5">
				<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
						{lang === "en-US" ? "Browser snapshot" : "浏览器快照"}
					</div>
					<div className="mt-4 grid gap-4">
						<div className="rounded-[24px] bg-slate-50 p-4">
							<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
								navigator.language
							</div>
							<div className="mt-2 text-lg font-bold text-slate-900">
								{browserInfo?.language || "pending..."}
							</div>
						</div>
						<div className="rounded-[24px] bg-slate-50 p-4">
							<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
								location.href
							</div>
							<div className="mt-2 break-all text-sm font-semibold text-slate-900">
								{browserInfo?.currentHref || requestUrl}
							</div>
						</div>
						<div className="rounded-[24px] bg-slate-50 p-4">
							<div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
								userAgent
							</div>
							<div className="mt-2 break-all text-sm text-slate-600">
								{browserInfo?.userAgent || "pending..."}
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
								{lang === "en-US" ? "Error Boundary" : "错误边界"}
							</div>
							<h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
								{lang === "en-US"
									? "Client-only render errors can be isolated"
									: "客户端渲染错误可以被局部隔离"}
							</h3>
						</div>
						<button
							type="button"
							onClick={() => setShouldCrash((prev) => !prev)}
							className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-100"
						>
							{shouldCrash
								? lang === "en-US"
									? "Disable crash"
									: "关闭崩溃"
								: lang === "en-US"
									? "Trigger crash"
									: "触发崩溃"}
						</button>
					</div>
					<div className="mt-4">
						<ClientErrorBoundary
							fallbackTitle={
								lang === "en-US"
									? "The boundary caught a client-side exception."
									: "错误边界已捕获客户端异常。"
							}
							fallbackMessage={
								lang === "en-US"
									? "This demonstrates client-only render protection after hydration. The surrounding SSR page stays intact."
									: "这演示了 hydration 之后的客户端渲染保护，外围 SSR 页面不会被一起打断。"
							}
						>
							<CrashProbe shouldCrash={shouldCrash} />
						</ClientErrorBoundary>
					</div>
				</div>

				<div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
					<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
						{lang === "en-US" ? "Meta capability" : "Meta 能力边界"}
					</div>
					<div className="mt-3 text-2xl font-black tracking-tight">
						{lang === "en-US"
							? "Current runtime injects title + description only"
							: "当前运行时仅注入 title + description"}
					</div>
					<div className="mt-4 space-y-3 text-sm text-slate-300">
						<div>
							<span className="font-semibold text-white">title</span>:{" "}
							{metaTitle}
						</div>
						<div>
							<span className="font-semibold text-white">description</span>:{" "}
							{metaDescription}
						</div>
						<div>
							{lang === "en-US"
								? "Open Graph, canonical, and richer SEO tags still require runtime extension in HtmlDocument / RenderViewService."
								: "Open Graph、canonical 等更丰富的 SEO 标签仍需要在 HtmlDocument / RenderViewService 层继续扩展。"}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
