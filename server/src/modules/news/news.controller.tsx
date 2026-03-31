import { NewsDetailPage, NewsListPage } from "@cms/ssr/pages";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { createPermGroup } from "@/common/common.permission";
import Lang from "@/common/lang.decorator";
import { ContentLang } from "@/constants";
import { ExportParamsDto, ResponseResult } from "@/interface";
import { UserByAdmin } from "@/modules/user_admin/user_admin.decorator";
import { UserAdminInfo } from "@/modules/user_admin/user_admin.dto";
import { AdminRoleGuard } from "@/modules/user_admin_role/user_admin_role.guard";
import { successResponse } from "@/utils";
import { exportData } from "@/utils/exportData";
import { RenderView } from "../render_view/render_view.decorator";
import {
	NewsByIdParamDto,
	NewsCreateDto,
	NewsDetailIdResponseDto,
	NewsDetailResponseDto,
	NewsListResponseDto,
	NewsQueryListDto,
	NewsUpdateDto,
} from "./news.dto";
import { NewsService } from "./news.service";

const MODULE_NAME = "新闻";
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class NewsController {
	constructor(private services: NewsService) {}

	@Get("/news")
	@RenderView(NewsListPage)
	async list(
		@Query() { current = 1 }: { current: number },
		@Lang() lang: ContentLang,
	) {
		const limit = 20;
		const [list, total] = await this.services.findList(
			{
				current,
				page_size: limit,
				order_key: "recommend",
				order_type: "DESC",
			},
			lang,
		);
		const max = total / limit;
		const next = current < max ? current + 1 : 0;
		const prev = current > 1 ? current - 1 : 0;

		return {
			title: "新闻列表",
			dataList: list,
			prev,
			next,
		};
	}

	@Get("/news/:id")
	@RenderView(NewsDetailPage)
	async detail(@Param() { id }: { id: number }, @Lang() lang: ContentLang) {
		const { current, next, prev } = await this.services.findNextAndPrev(
			id,
			lang,
		);
		const pageData = {
			title: current?.title || "新闻详情",
			info: current,
			next: next
				? {
						title: next.title,
						id: next.id,
					}
				: void 0,
			prev: prev
				? {
						title: prev.title,
						id: prev.id,
					}
				: void 0,
		};
		return pageData;
	}

	@Post("/api/admin/news/list")
	@ApiOkResponse({
		type: NewsListResponseDto,
	})
	@ApiBody({ type: NewsQueryListDto })
	@AdminRoleGuard(createPerm("admin:news:list", `获取${MODULE_NAME}列表`))
	async apiList(@Body() body: NewsQueryListDto) {
		const [list, total] = await this.services.findList(body);
		return successResponse({ list, total });
	}

	@Post("/api/admin/news/info")
	@ApiOkResponse({
		type: NewsDetailResponseDto,
	})
	@AdminRoleGuard(createPerm("admin:news:info", `获取${MODULE_NAME}详情`))
	async apiDetail(@Body() { id }: NewsByIdParamDto) {
		const data = await this.services.findById(id);
		return successResponse(data);
	}

	@Post("/api/admin/news/create")
	@ApiOkResponse({
		type: NewsDetailResponseDto,
	})
	@AdminRoleGuard(createPerm("admin:news:create", `新增${MODULE_NAME}`))
	async apiCreate(
		@Body() data: NewsCreateDto,
		@UserByAdmin() user: UserAdminInfo,
	) {
		const newData = await this.services.create(data, user);
		return successResponse(newData, "创建成功");
	}

	@Post("/api/admin/news/update")
	@ApiOkResponse({
		type: NewsDetailIdResponseDto,
	})
	@AdminRoleGuard(createPerm("admin:news:update", `修改${MODULE_NAME}`))
	async apiUpdate(@Body() data: NewsUpdateDto) {
		await this.services.update(data);
		return successResponse(data.id, "修改成功");
	}

	@Post("/api/admin/news/delete")
	@ApiOkResponse({
		type: ResponseResult<null>,
	})
	@AdminRoleGuard(createPerm("admin:news:delete", `删除${MODULE_NAME}`))
	async apiDelete(@Body() { id }: NewsByIdParamDto) {
		await this.services.remove(id);
		return successResponse(null, "删除成功");
	}

	@Post("/api/admin/news/export")
	@AdminRoleGuard(createPerm("admin:news:export", `导出${MODULE_NAME}`))
	@ApiOkResponse({ type: ResponseResult<null> })
	@ApiBody({ type: ExportParamsDto })
	async export(@Body() body: ExportParamsDto) {
		const dataList = await this.services.findAll();
		return exportData({
			dataList,
			exportType: body.export_type,
			repository: this.services.repository,
			name: MODULE_NAME,
		});
	}
}
