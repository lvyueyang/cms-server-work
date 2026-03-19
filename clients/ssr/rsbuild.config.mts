import path from "node:path";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

const rootDir = __dirname;
const srcDir = path.join(rootDir, "src");
const serverDistDir = path.join(rootDir, "dist/node");
const webDistDir = path.join(rootDir, "dist/web");

function normalizeModuleId(resourcePath: string) {
	return path
		.relative(srcDir, resourcePath)
		.split(path.sep)
		.join("/")
		.replace(/\.(t|j)sx?$/, "");
}

function createRuntimeImportPath(resourcePath: string) {
	const runtimePath = path.join(srcDir, "runtime/client-component");
	const relativePath = path
		.relative(path.dirname(resourcePath), runtimePath)
		.split(path.sep)
		.join("/");
	return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

function parseUseClientExports(code: string) {
	const exportNames = new Set<string>();
	let hasDefaultExport = false;

	for (const match of code.matchAll(
		/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
	)) {
		exportNames.add(match[1]);
	}
	for (const match of code.matchAll(
		/export\s+(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/g,
	)) {
		exportNames.add(match[1]);
	}
	for (const match of code.matchAll(/export\s*\{([^}]+)\}/g)) {
		const content = match[1];
		for (const part of content.split(",")) {
			const [rawName, rawAlias] = part.split(/\s+as\s+/).map((item) => item.trim());
			const exportName = rawAlias || rawName;
			if (exportName) {
				exportNames.add(exportName);
			}
		}
	}
	if (
		/export\s+default\s+(?:async\s+)?function(?:\s+[A-Za-z_$][\w$]*)?/g.test(code) ||
		/export\s+default\s+[A-Za-z_$][\w$]*/g.test(code)
	) {
		hasDefaultExport = true;
	}

	return {
		exportNames: [...exportNames],
		hasDefaultExport,
	};
}

function isUseClientModule(code: string) {
	const normalized = code.replace(/^\uFEFF/, "").trimStart();
	return (
		normalized.startsWith('"use client"') ||
		normalized.startsWith("'use client'") ||
		normalized.startsWith('"use client";') ||
		normalized.startsWith("'use client';")
	);
}

function createUseClientPlugin() {
	return {
		name: "cms-ssr-use-client",
		setup(api: any) {
			api.transform(
				{
					test: /\.[jt]sx?$/,
					targets: ["node", "web"],
				},
				(args: { code: string; resourcePath: string; target?: string }) => {
					const { code, resourcePath, target } = args;
					if (!resourcePath.startsWith(srcDir) || !isUseClientModule(code)) {
						return null;
					}

					const moduleId = normalizeModuleId(resourcePath);
					const runtimeImportPath = createRuntimeImportPath(resourcePath);
					const { exportNames, hasDefaultExport } = parseUseClientExports(code);

					if (target !== "web") {
						const statements = [
							`import { createClientComponentReference } from "${runtimeImportPath}";`,
						];
						for (const exportName of exportNames) {
							statements.push(
								`export const ${exportName} = createClientComponentReference("${moduleId}", "${exportName}");`,
							);
						}
						if (hasDefaultExport) {
							statements.push(
								`const __default_export__ = createClientComponentReference("${moduleId}", "default");`,
							);
							statements.push("export default __default_export__;");
						}
						return {
							code: statements.join("\n"),
						};
					}

					const registerLines = [
						code,
						`import { registerClientComponent } from "${runtimeImportPath}";`,
					];
					for (const exportName of exportNames) {
						registerLines.push(
							`registerClientComponent("${moduleId}", "${exportName}", ${exportName});`,
						);
					}
					if (hasDefaultExport) {
						registerLines.push(
							'registerClientComponent("' +
								moduleId +
								'", "default", __WEBPACK_DEFAULT_EXPORT__);',
						);
					}
					return {
						code: registerLines.join("\n"),
					};
				},
			);
		},
	};
}

export default defineConfig({
	plugins: [pluginReact(), pluginTypeCheck(), createUseClientPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	environments: {
		web: {
			source: {
				entry: {
					app: "./src/client.tsx",
				},
			},
			output: {
				target: "web",
				distPath: {
					root: webDistDir,
				},
				assetPrefix: "/_fe_/",
				manifest: {
					filename: "manifest.json",
				},
				cleanDistPath: true,
			},
		},
		node: {
			source: {
				entry: {
					index: "./src/index.ts",
				},
			},
			output: {
				target: "node",
				distPath: {
					root: serverDistDir,
				},
				cleanDistPath: true,
				emitCss: false,
			},
			tools: {
				rspack: {
					externals: {
						react: "commonjs react",
						"react-dom": "commonjs react-dom",
						"react-dom/server": "commonjs react-dom/server",
						i18next: "commonjs i18next",
					},
					output: {
						library: {
							type: "commonjs2",
						},
						chunkFormat: "commonjs",
					},
				},
			},
		},
	},
});
