import { request } from "@/request";

/**
 * 公共审计报告查询。
 *
 * 注意: 当前后端接口路径未在本仓库中检索到明确实现，本函数先提供最小可用封装以保证前端构建通过。
 * 若后端接口路径不同，请按真实 API 调整此处 URL。
 */
export function getPublicScanTaskAuditReport(token: string) {
	return request.get<any>(`/api/public/audit-report/${encodeURIComponent(token)}`, {
		ignoreNotice: true,
		ignoreLogin: true,
	} as any);
}

