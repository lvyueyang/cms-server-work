import {
	GetTrackEventListQueryDto,
	GetTrackEventListResponseDto,
} from "@cms/api-interface";
import { AIP_FIX } from "@/constants";
import { request } from "@/request";

/** 列表 */
export const getListApi = (params: GetTrackEventListQueryDto) => {
	return request.post<GetTrackEventListResponseDto>(
		`${AIP_FIX}/track-event/list`,
		params,
	);
};
