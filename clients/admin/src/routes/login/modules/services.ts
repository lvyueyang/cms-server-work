import {
	UserAdminHasRootUserResponse,
	UserAdminLoginBody,
	UserAdminLoginResponse,
} from "@cms/api-interface";
import { AIP_FIX } from "@/constants";
import { request } from "@/request";

export const login = (body: UserAdminLoginBody) => {
	return request.post<UserAdminLoginResponse>(`${AIP_FIX}/login`, body);
};

export const hasRootUser = () => {
	return request.get<UserAdminHasRootUserResponse>(
		`${AIP_FIX}/has-root-user-admin`,
	);
};
