/// <reference types="node" />

declare namespace NodeJS {
	interface ProcessEnv {
		/** 打包环境 */
		readonly NODE_ENV: "development" | "production";
	}
}

declare module "grapesjs-preset-newsletter";
declare module "grapesjs-preset-webpage";

declare module "*.png" {
	const src: string;
	export default src;
}

declare module "*.jpg" {
	const src: string;
	export default src;
}

declare module "*.jpeg" {
	const src: string;
	export default src;
}

declare module "*.webp" {
	const src: string;
	export default src;
}

declare module "*.svg" {
	const src: string;
	export default src;
}
