import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";
import type { SsrBootstrapPayload } from "./types";
import { AppProvider } from "./context";

const CLIENT_COMPONENT_ATTRIBUTE = "data-cms-client-component";
const CLIENT_PROPS_ATTRIBUTE = "data-cms-client-props";

const clientComponentRegistry = new Map<string, ComponentType<any>>();

function createRegistryKey(moduleId: string, exportName: string) {
	return `${moduleId}#${exportName}`;
}

export function registerClientComponent(
	moduleId: string,
	exportName: string,
	component: ComponentType<any>,
) {
	clientComponentRegistry.set(createRegistryKey(moduleId, exportName), component);
}

export function createClientComponentReference(
	moduleId: string,
	exportName: string,
) {
	return function ClientComponentReference(props: Record<string, unknown>) {
		return (
			<div
				data-cms-client-component={createRegistryKey(moduleId, exportName)}
				data-cms-client-props={encodeURIComponent(JSON.stringify(props ?? {}))}
			/>
		);
	};
}

function readBootstrapPayload() {
	const element = document.getElementById("__CMS_SSR_DATA__");
	if (!element?.textContent) {
		throw new Error("Missing __CMS_SSR_DATA__ payload");
	}
	return JSON.parse(element.textContent) as SsrBootstrapPayload;
}

export function mountClientComponents() {
	const bootstrap = readBootstrapPayload();
	const elements = document.querySelectorAll<HTMLElement>(
		`[${CLIENT_COMPONENT_ATTRIBUTE}]`,
	);

	for (const element of elements) {
		const key = element.getAttribute(CLIENT_COMPONENT_ATTRIBUTE);
		if (!key) {
			continue;
		}
		const Component = clientComponentRegistry.get(key);
		if (!Component) {
			continue;
		}
		const rawProps = element.getAttribute(CLIENT_PROPS_ATTRIBUTE) ?? "%7B%7D";
		const props = JSON.parse(decodeURIComponent(rawProps));

		createRoot(element).render(
			<AppProvider bootstrap={bootstrap}>
				<Component {...props} />
			</AppProvider>,
		);
	}
}
