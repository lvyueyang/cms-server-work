import {
	GetTrackEventChartQueryDto,
	GetTrackEventChartResponseDto,
} from "@cms/api-interface";
import { AIP_FIX } from "@/constants";
import { request } from "@/request";

/** 查询 */
export const queryApi = (body: GetTrackEventChartQueryDto) => {
	return request.post<GetTrackEventChartResponseDto>(
		`${AIP_FIX}/track/query-chart`,
		body,
	);
};
