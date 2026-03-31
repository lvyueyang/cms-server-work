import { ImageValidateCodeResponseDto } from "@cms/api-interface";
import { request } from "@/request";

export * from "./user";

export const getImageCode = () => {
	return request.get<ImageValidateCodeResponseDto["data"]>(
		`/api/image-validate-code`,
	);
};
