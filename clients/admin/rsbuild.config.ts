import path from "node:path";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";
import workConfig from "../../work.config.json";

const adminBase = `/${workConfig.cms_admin_path}`;
const targetProxy = "http://127.0.0.1:7001/";

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],
	source: {
		entry: {
			index: "./src/main.tsx",
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	html: {
		title: "管理后台",
		mountId: "root",
	},
	server: {
		port: Number(process.env.PORT || 9000),
		base: adminBase,
		proxy: {
			"/api": {
				target: targetProxy,
				changeOrigin: true,
				secure: false,
			},
			"/uploadfile": {
				target: targetProxy,
				changeOrigin: true,
				secure: false,
			},
			"/getfile": {
				target: targetProxy,
				changeOrigin: true,
				secure: false,
			},
		},
		historyApiFallback: true,
	},
	output: {
		assetPrefix: `${adminBase}/`,
		cleanDistPath: true,
		distPath: {
			root: path.join(__dirname, "../../server/admin-ui/dist"),
		},
	},
	tools: {
		rspack: {
			plugins: [
				tanstackRouter({
					target: "react",
					autoCodeSplitting: false,
					routeFileIgnorePattern: "(^|/)(module|modules|[^/]+-module)(/|$)",
				}),
			],
		},
	},
});
