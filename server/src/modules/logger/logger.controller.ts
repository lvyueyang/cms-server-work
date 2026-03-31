import {
	createReadStream,
	existsSync,
	readdirSync,
	readFileSync,
} from "node:fs";
import { join } from "node:path";
import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Res,
	StreamableFile,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import dayjs from "dayjs";
import type { Response } from "express";
import { createPermGroup } from "@/common/common.permission";
import { getLogDirPath, successResponse } from "@/utils";
import { AdminRoleGuard } from "../user_admin_role/user_admin_role.guard";
import {
	LoggerByDateParamDto,
	LoggerDetailResponseDto,
	LoggerFileParamDto,
	LoggerListResponseDto,
} from "./logger.dto";

const MODULE_NAME = "系统日志";
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class LoggerController {
	logDir = getLogDirPath();

	@Get("/api/admin/logger")
	@AdminRoleGuard(createPerm("admin:logger:list", "获取日志列表"))
	@ApiOkResponse({
		type: LoggerListResponseDto,
	})
	async apiList() {
		if (!existsSync(this.logDir)) {
			return successResponse([]);
		}
		const list = readdirSync(this.logDir).filter((f) =>
			/^\d{4}-\d{2}-\d{2}$/.test(f),
		);
		list.sort((a, b) => {
			if (dayjs(a).isAfter(dayjs(b))) {
				return -1;
			}
			return 1;
		});
		return successResponse(list);
	}

	@Get("/api/admin/logger/:date/files")
	@AdminRoleGuard(createPerm("admin:logger:list", "获取日志文件列表"))
	async apiListFiles(@Param() { date }: LoggerByDateParamDto) {
		const dir = join(this.logDir, date);
		if (!existsSync(dir)) {
			return successResponse([]);
		}
		const list = readdirSync(dir).filter((f) => f.endsWith(".log"));
		return successResponse(list);
	}

	@Get("/api/admin/logger/:date/:filename")
	@AdminRoleGuard(createPerm("admin:logger:info", "获取日志详情"))
	async apiFileContent(@Param() { date, filename }: LoggerFileParamDto) {
		const p = join(this.logDir, date, filename);
		if (!existsSync(p)) {
			throw new NotFoundException("日志文件不存在");
		}
		const content = readFileSync(p).toString("utf-8");
		return successResponse(content ? content.split("\n").filter(Boolean) : []);
	}

	@Get("/api/admin/logger/:date/:filename/download")
	@AdminRoleGuard(createPerm("admin:logger:download", "下载日志文件"))
	async apiDownloadFile(
		@Param() { date, filename }: LoggerFileParamDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const p = join(this.logDir, date, filename);
		if (!existsSync(p)) {
			throw new NotFoundException("日志文件不存在");
		}
		const file = createReadStream(p);
		res.set({
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="${filename}"`,
		});
		return new StreamableFile(file);
	}
}
