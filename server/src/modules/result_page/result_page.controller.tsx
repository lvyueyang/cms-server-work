import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResultPage } from "@cms/ssr/pages";
import { RenderView } from "../render_view/render_view.decorator";

@ApiTags("Result Page")
@Controller("result-page")
export class ResultPageController {
	@Get()
	@RenderView(ResultPage)
	index(
		@Query()
		query: {
			status?: "success" | "error" | "warning";
			title?: string;
			description?: string;
			type?: "user_register" | "back" | "user_login";
		},
	) {
		return {
			title: query.title || "结果",
			status: query.status,
			description: query.description,
			type: query.type,
		};
	}
}
