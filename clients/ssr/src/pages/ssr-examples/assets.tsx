import logoImage from "../../assets/images/logo.png";
import monitorImage from "../../assets/images/examples/monitor.jpg";
import teamImage from "../../assets/images/examples/team.jpg";
import workspaceImage from "../../assets/images/examples/workspace.jpg";
import type { PageComponentProps } from "../../runtime/types";
import {
	type ExampleResourceLink,
	ExampleSectionHeader,
	SsrExampleLayout,
} from "./shared";

export interface SsrExamplesAssetsPageData {
	title: string;
	description: string;
	cover: {
		src: string;
		alt: string;
	};
	imported_images: Array<{
		title: string;
		description: string;
		kind: string;
	}>;
	resource_links: ExampleResourceLink[];
	prefixes: Array<{
		title: string;
		value: string;
		description: string;
	}>;
}

const importedAssetImages = [
	{
		src: logoImage,
		title: "Imported PNG",
		description: "Bundled from clients/ssr/src/assets/images/logo.png",
		kind: "import png",
	},
	{
		src: teamImage,
		title: "Imported JPG 01",
		description: "Bundled from clients/ssr/src/assets/images/examples/team.jpg",
		kind: "import jpg",
	},
	{
		src: workspaceImage,
		title: "Imported JPG 02",
		description: "Bundled from clients/ssr/src/assets/images/examples/workspace.jpg",
		kind: "import jpg",
	},
	{
		src: monitorImage,
		title: "Imported JPG 03",
		description: "Bundled from clients/ssr/src/assets/images/examples/monitor.jpg",
		kind: "import jpg",
	},
];

export function SsrExamplesAssetsPage({
	pageData,
}: PageComponentProps<SsrExamplesAssetsPageData>) {
	return (
		<SsrExampleLayout
			title={pageData.title}
			desc={pageData.description}
			currentPath="/ssr-examples/assets"
		>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-6">
				<ExampleSectionHeader
					eyebrow="ASSETS"
					title="Static files and bundle assets are separate concerns"
					desc="This page focuses on current asset boundaries: public static files, manifest-driven bundle injection, and upload files."
				/>
				<div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
					<div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
						<img
							src={pageData.cover.src}
							alt={pageData.cover.alt}
							className="h-full min-h-[320px] w-full object-cover bg-slate-100 p-10"
						/>
					</div>
					<div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
						<div className="grid gap-4">
							{pageData.resource_links.map((item) => (
								<a
									key={item.href}
									href={item.href}
									className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
								>
									<div className="text-lg font-bold text-slate-900">{item.label}</div>
									<div className="mt-1 break-all text-sm font-semibold text-slate-500">
										{item.href}
									</div>
									<div className="mt-2 text-sm text-slate-600">{item.description}</div>
								</a>
							))}
						</div>
					</div>
				</div>
				<div className="space-y-4">
					<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
						Imported Asset Modules
					</div>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{importedAssetImages.map((item) => (
							<article
								key={item.src}
								className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
							>
								<div className="aspect-[4/3] overflow-hidden bg-slate-100">
									<img
										src={item.src}
										alt={item.title}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="p-4">
									<div className="flex items-center justify-between gap-3">
										<div className="text-base font-bold text-slate-900">
											{item.title}
										</div>
										<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
											{item.kind}
										</span>
									</div>
									<div className="mt-2 text-sm text-slate-600">
										{item.description}
									</div>
									<div className="mt-3 break-all text-xs font-semibold text-slate-500">
										{item.src}
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{pageData.prefixes.map((item) => (
						<div
							key={item.title}
							className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
						>
							<div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
								{item.title}
							</div>
							<div className="mt-2 break-all text-lg font-black tracking-tight text-slate-900">
								{item.value}
							</div>
							<div className="mt-2 text-sm text-slate-600">{item.description}</div>
						</div>
					))}
				</div>
			</section>
		</SsrExampleLayout>
	);
}
