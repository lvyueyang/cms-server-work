"use client";

import { useState } from "react";

export function Count() {
	const [value, setValue] = useState(0);

	return (
		<div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
			<div className="text-sm font-medium text-slate-500">Client Component</div>
			<div className="mt-3 text-4xl font-black tracking-tight text-slate-900">
				{value}
			</div>
			<div className="mt-4 flex gap-3">
				<button
					type="button"
					onClick={() => setValue((current) => current + 1)}
					className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
				>
					+
				</button>
				<button
					type="button"
					onClick={() => setValue((current) => current - 1)}
					className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
				>
					-
				</button>
			</div>
		</div>
	);
}
