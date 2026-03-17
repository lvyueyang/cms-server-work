import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PaginationAndOrder, ResponseResult } from "@/interface";
import { BusinessConfig } from "./business_config.entity";

export class BusinessConfigInfo extends BusinessConfig {}

export class BusinessConfigList {
	@ApiProperty({
		description: "列表",
	})
	list: BusinessConfigInfo[];

	@ApiProperty({
		description: "总数",
	})
	total: number;
}

export class BusinessConfigCreateDto extends PickType(BusinessConfig, [
	"title",
	"code",
	"content_type",
	"content",
	"is_available",
]) {}

export class BusinessConfigUpdateDto extends PartialType(
	BusinessConfigCreateDto,
) {
	@ApiProperty({
		description: "业务配置 ID",
	})
	@IsNotEmpty()
	readonly id: BusinessConfig["id"];
}

export class BusinessConfigByIdParamDto {
	@ApiProperty({
		description: "业务配置 ID",
	})
	@IsNotEmpty()
	readonly id: BusinessConfig["id"];
}

export class BusinessConfigQueryListDto extends PaginationAndOrder<
	keyof BusinessConfig
> {
	@ApiProperty({ description: "业务配置名称-模糊搜索" })
	keyword?: string;
}

export class BusinessConfigListResponseDto extends ResponseResult {
	data: BusinessConfigList;
}

export class BusinessConfigDetailResponseDto extends ResponseResult {
	data: BusinessConfigInfo;
}

export class BusinessConfigDetailIdResponseDto extends ResponseResult {
	data: number;
}
