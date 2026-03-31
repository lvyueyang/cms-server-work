import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

function ErrorState({ title, message }: { title: string; message: string }) {
	return (
		<MainLayout>
			<section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
				<div className="rounded-full border border-black/10 bg-black px-4 py-1 text-sm font-semibold text-white">
					System
				</div>
				<h1 className="text-4xl font-black tracking-tight text-slate-900">
					{title}
				</h1>
				<p className="max-w-xl text-base text-slate-600">{message}</p>
				<a
					href="/"
					className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
				>
					返回首页
				</a>
			</section>
		</MainLayout>
	);
}

export function NotFoundPage(_props: PageComponentProps<{ title?: string }>) {
	return <ErrorState title="404" message="页面不存在或已经被移除。" />;
}

export function InternalServerErrorPage(
	_props: PageComponentProps<{ title?: string }>,
) {
	return <ErrorState title="500" message="页面渲染失败，请稍后重试。" />;
}
