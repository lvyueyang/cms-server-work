import React from "react";
import { adminMenuConfig } from "./menu-config";

interface ClientRouteTreeNode {
	path?: string;
	title?: string;
	meta?: Record<string, unknown>;
	routes?: ClientRouteTreeNode[];
}

function toClientRouteTree(routes: ClientRouteTreeNode[]): Array<
	Omit<ClientRouteTreeNode, "routes"> & {
		children?: ReturnType<typeof toClientRouteTree>;
	}
> {
	return routes.map((route) => ({
		...route,
		children: route.routes ? toClientRouteTree(route.routes) : undefined,
	}));
}

export function useAppData() {
	const clientRoutes = React.useMemo(
		() => toClientRouteTree(adminMenuConfig),
		[],
	);

	return React.useMemo(
		() => ({
			clientRoutes,
		}),
		[clientRoutes],
	);
}
