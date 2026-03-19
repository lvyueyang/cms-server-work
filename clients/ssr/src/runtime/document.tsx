import type { PropsWithChildren } from "react";
import type { PageAssetManifest, SsrBootstrapPayload } from "./types";

export function HtmlDocument({
	title,
	description,
	lang,
	assets,
	bootstrap,
	children,
}: PropsWithChildren<{
	title: string;
	description?: string;
	lang: string;
	assets: PageAssetManifest;
	bootstrap: SsrBootstrapPayload;
}>) {
	return (
		<html lang={lang}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>
				{description ? <meta name="description" content={description} /> : null}
				{assets.css.map((href) => (
					<link key={href} rel="stylesheet" href={href} />
				))}
			</head>
			<body>
				<div id="root">{children}</div>
				<script
					id="__CMS_SSR_DATA__"
					type="application/json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(bootstrap).replace(/<\//g, "<\\/"),
					}}
				/>
				{assets.js.map((src) => (
					<script key={src} src={src} defer />
				))}
			</body>
		</html>
	);
}
