import type { Request, Response } from "express";
import type { ReactElement } from "react";

export interface GlobalData {
	company_email: string;
	company_tell: string;
	company_address: string;
	company_address_url: string;
	custom_header_code: string;
	custom_footer_code: string;
	i18n_enabled: boolean;
	keywords: string;
}

export interface CurrentUserInfo {
	id: number | string;
	username?: string | null;
	cname?: string | null;
	email?: string | null;
	phone?: string | null;
}

export interface RequestContext {
	req: Request;
	res: Response;
	currentUser: CurrentUserInfo | null;
}

export interface PageComponentProps<TPageData = unknown> {
	pageData: TPageData;
	lang: string;
	t: (key: string, fallback?: string) => string;
	globalData: GlobalData;
	requestContext: RequestContext;
}

export interface SsrBootstrapPayload {
	lang: string;
	translations: Record<string, string>;
	globalData: GlobalData;
	currentUser: CurrentUserInfo | null;
}

export interface PageAssetManifest {
	js: string[];
	css: string[];
}

export type SsrPageComponent<TPageData = unknown> = (
	props: PageComponentProps<TPageData>,
) => ReactElement;
