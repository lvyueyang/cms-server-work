import type { SsrPageComponent } from "@cms/ssr/server";
import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import {
	RENDER_VIEW_OPTIONS_METADATA,
	RENDER_VIEW_PAGE_METADATA,
	type RenderMode,
} from "./render_view.constant";
import { RenderViewInterceptor } from "./render_view.interceptor";

interface RenderViewDecoratorOptions {
	renderMode?: RenderMode;
}

export function RenderView<TPageData = unknown>(
	pageComponent: SsrPageComponent<TPageData>,
	options: RenderViewDecoratorOptions = {},
) {
	return applyDecorators(
		SetMetadata(RENDER_VIEW_PAGE_METADATA, pageComponent),
		SetMetadata(RENDER_VIEW_OPTIONS_METADATA, options),
		UseInterceptors(RenderViewInterceptor),
		ApiExcludeEndpoint(),
	);
}
