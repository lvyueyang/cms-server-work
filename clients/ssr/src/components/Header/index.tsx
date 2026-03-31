import { useGlobalData } from "../../runtime/context";

export function Header() {
	const globalData = useGlobalData();

	return (
		<header className="border-b border-slate-200 bg-white/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<a
					href="/"
					className="text-xl font-black tracking-tight text-slate-900"
				>
					CMS SSR
				</a>
				<nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
					<a href="/ssr-examples" className="transition hover:text-slate-900">
						SSR 示例
					</a>
					<a href="/news" className="transition hover:text-slate-900">
						新闻
					</a>
					<a href="/login" className="transition hover:text-slate-900">
						登录
					</a>
					{globalData.company_email ? (
						<a
							href={`mailto:${globalData.company_email}`}
							className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
						>
							联系
						</a>
					) : null}
				</nav>
			</div>
		</header>
	);
}
