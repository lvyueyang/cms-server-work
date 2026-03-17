import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { createPermGroup } from "@/common/common.permission";
import { ResponseResult } from "@/interface";
import { RenderViewService } from "@/modules/render_view/render_view.service";
import { UserByAdmin } from "@/modules/user_admin/user_admin.decorator";
import { UserAdminInfo } from "@/modules/user_admin/user_admin.dto";
import { AdminRoleGuard } from "@/modules/user_admin_role/user_admin_role.guard";
import { successResponse } from "@/utils";
import {
	BusinessConfigByIdParamDto,
	BusinessConfigCreateDto,
	BusinessConfigDetailIdResponseDto,
	BusinessConfigDetailResponseDto,
	BusinessConfigListResponseDto,
	BusinessConfigQueryListDto,
	BusinessConfigUpdateDto,
} from "./business_config.dto";
import { BusinessConfigService } from "./business_config.service";

const MODULE_NAME = "业务配置";
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class BusinessConfigController {
	constructor(
		private services: BusinessConfigService,
		private renderViewService: RenderViewService,
	) {}

	@Post("/api/admin/business_config/list")
	@ApiOkResponse({
		type: BusinessConfigListResponseDto,
	})
	@ApiBody({ type: BusinessConfigQueryListDto })
	@AdminRoleGuard(
		createPerm("admin:business_config:list", `获取${MODULE_NAME}列表`),
	)
	async apiList(@Body() body: BusinessConfigQueryListDto) {
		const [list, total] = await this.services.findList(body);
		return successResponse({ list, total });
	}

	@Post("/api/admin/business_config/info")
	@ApiOkResponse({
		type: BusinessConfigDetailResponseDto,
	})
	@AdminRoleGuard(
		createPerm("admin:business_config:info", `获取${MODULE_NAME}详情`),
	)
	async apiDetail(@Body() { id }: BusinessConfigByIdParamDto) {
		const data = await this.services.findById(id);
		return successResponse(data);
	}

	@Post("/api/admin/business_config/create")
	@ApiOkResponse({
		type: BusinessConfigDetailResponseDto,
	})
	@AdminRoleGuard(
		createPerm("admin:business_config:create", `新增${MODULE_NAME}`),
	)
	async apiCreate(
		@Body() data: BusinessConfigCreateDto,
		@UserByAdmin() user: UserAdminInfo,
	) {
		const newData = await this.services.create(data, user);
		await this.renderViewService.loadGlobal();
		return successResponse(newData, "创建成功");
	}

	@Post("/api/admin/business_config/update")
	@ApiOkResponse({
		type: BusinessConfigDetailIdResponseDto,
	})
	@AdminRoleGuard(
		createPerm("admin:business_config:update", `修改${MODULE_NAME}`),
	)
	async apiUpdate(@Body() data: BusinessConfigUpdateDto) {
		await this.services.update(data);
		await this.renderViewService.loadGlobal();
		return successResponse(data.id, "修改成功");
	}

	@Post("/api/admin/business_config/delete")
	@ApiOkResponse({
		type: ResponseResult<null>,
	})
	@AdminRoleGuard(
		createPerm("admin:business_config:delete", `删除${MODULE_NAME}`),
	)
	async apiDelete(@Body() { id }: BusinessConfigByIdParamDto) {
		await this.services.remove(id);
		await this.renderViewService.loadGlobal();
		return successResponse(null, "删除成功");
	}
}
