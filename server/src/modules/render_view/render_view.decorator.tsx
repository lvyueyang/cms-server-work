import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import type { SsrPageComponent } from "@cms/ssr/server";
import { RenderViewInterceptor } from "./render_view.interceptor";
import { RENDER_VIEW_PAGE_METADATA } from "./render_view.constant";

export function RenderView<TPageData = unknown>(
	pageComponent: SsrPageComponent<TPageData>,
) {
	return applyDecorators(
		SetMetadata(RENDER_VIEW_PAGE_METADATA, pageComponent),
		UseInterceptors(RenderViewInterceptor),
		ApiExcludeEndpoint(),
	);
}
