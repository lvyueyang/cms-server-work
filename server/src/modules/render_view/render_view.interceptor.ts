import type { SsrPageComponent } from "@cms/ssr/server";
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
	RENDER_VIEW_OPTIONS_METADATA,
	RENDER_VIEW_PAGE_METADATA,
	type RenderMode,
} from "./render_view.constant";
import { RenderViewService } from "./render_view.service";

interface RenderViewMetadataOptions {
	renderMode?: RenderMode;
}

@Injectable()
export class RenderViewInterceptor implements NestInterceptor {
	constructor(
		private readonly renderViewService: RenderViewService,
		private readonly reflector: Reflector,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const pageComponent = this.reflector.get<SsrPageComponent>(
			RENDER_VIEW_PAGE_METADATA,
			context.getHandler(),
		);
		const options =
			this.reflector.get<RenderViewMetadataOptions>(
				RENDER_VIEW_OPTIONS_METADATA,
				context.getHandler(),
			) || {};

		return next.handle().pipe(
			switchMap(async (pageData) => {
				return this.renderViewService.renderPage(
					context,
					pageComponent,
					pageData,
					options,
				);
			}),
		);
	}
}
