import type { ReactNode } from "react";
import { Header } from "../components/Header";
import "../styles/global.css";

export function MainLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_30%,#e2e8f0_100%)] text-slate-900">
			<Header />
			<main>{children}</main>
			<footer className="border-t border-slate-200 bg-white/80">
				<div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">
					Powered by React SSR + NestJS
				</div>
			</footer>
		</div>
	);
}
