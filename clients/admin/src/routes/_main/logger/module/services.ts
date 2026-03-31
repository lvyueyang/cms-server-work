import { LoggerListResponseDto } from "@cms/api-interface";
import { AIP_FIX } from "@/constants";
import { request } from "@/request";
import { Result } from "@/types";

export interface LoggerItem {
	context: string;
	level: string;
	message: string;
	trace: string;
}

/** 列表 */
export const getListApi = () => {
	return request.get<LoggerListResponseDto>(`${AIP_FIX}/logger`);
};

/** 文件列表 */
export const getFilesApi = (date: string) => {
	return request.get<Result<string[]>>(`${AIP_FIX}/logger/${date}/files`);
};

/** 文件详情 */
export const getFileContentApi = async (date: string, filename: string) => {
	const res = await request.get<Result<string[]>>(
		`${AIP_FIX}/logger/${date}/${filename}`,
	);
	return {
		...res,
		data: {
			...res.data,
			data: res.data.data
				.filter((i) => i.trim())
				.map((item) => {
					try {
						const obj = JSON.parse(item);
						return obj as LoggerItem;
					} catch (e) {
						return { message: item } as LoggerItem;
					}
				}),
		},
	};
};

/** 下载地址 */
export const getDownloadUrl = (date: string, filename: string) => {
	return `${AIP_FIX}/logger/${date}/${filename}/download`;
};
