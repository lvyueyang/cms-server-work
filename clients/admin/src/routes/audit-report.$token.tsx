import { Alert, Button, Card, Result, Skeleton, Space, Tag, Typography } from "antd";
import { useRequest } from "ahooks";
import { createFileRoute, useParams } from "@tanstack/react-router";
import MarkdownPreview from "@/components/MarkdownPreview";
import { getPublicScanTaskAuditReport } from "./_main/site-project/module/services";

interface ScanTaskAuditReport {
	project_name?: string;
	project_url?: string | null;
	task_id?: string;
	task_status?: string;
	generated_at?: string | null;
	completed_at?: string | null;
	markdown?: string;
}

function formatDateTime(value?: string | null) {
	if (!value) return "-";
	return new Date(value).toLocaleString();
}

function AuditReportPage() {
	const { token } = useParams({ strict: false }) as { token?: string };

	const { data, loading, error } = useRequest(
		async () => {
			if (!token) {
				throw new Error("缺少报告 token");
			}
			const response = await getPublicScanTaskAuditReport(token);
			return response.data.data as ScanTaskAuditReport;
		},
		{
			refreshDeps: [token],
		},
	);

	if (loading) {
		return (
			<div style={{ minHeight: "100vh", padding: 24, background: "#f5f7fa" }}>
				<Card style={{ maxWidth: 1080, margin: "0 auto" }}>
					<Skeleton active paragraph={{ rows: 12 }} />
				</Card>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
				<Result
					status="404"
					title="审计报告不存在"
					subTitle="报告可能尚未生成，或者访问链接已失效。"
				/>
			</div>
		);
	}

	return (
		<div style={{ minHeight: "100vh", background: "#eef2f6", padding: 16 }}>
			<Card
				style={{ maxWidth: 1180, margin: "0 auto" }}
				bodyStyle={{ padding: 16 }}
			>
				<Space direction="vertical" size={16} style={{ width: "100%" }}>
					<div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
						<div>
							<Typography.Title level={3} style={{ margin: 0 }}>
								内容审计报告
							</Typography.Title>
							<Space size={8} wrap style={{ marginTop: 8 }}>
								<Tag color="blue">{data.project_name}</Tag>
								<Tag>{data.task_id}</Tag>
								<Tag color={data.task_status === "completed" ? "green" : "default"}>
									{data.task_status}
								</Tag>
							</Space>
						</div>
						<Space>
							<Button onClick={() => window.print()}>打印 / 导出 PDF</Button>
						</Space>
					</div>

					<Alert
						type="info"
						showIcon
						message={
							<Space size={24} wrap>
								<span>项目地址：{data.project_url || "-"}</span>
								<span>生成时间：{formatDateTime(data.generated_at)}</span>
								<span>完成时间：{formatDateTime(data.completed_at)}</span>
							</Space>
						}
					/>

					<MarkdownPreview
						value={data.markdown || ""}
						style={{
							maxWidth: 960,
							margin: "0 auto",
							border: "1px solid #d9d9d9",
							borderRadius: 4,
							background: "#fff",
							padding: "40px 48px",
						}}
					/>
				</Space>
			</Card>
			<style>{`
				@media (max-width: 768px) {
					.markdown-preview {
						padding: 20px 16px 32px !important;
					}
				}
			`}</style>
		</div>
	);
}

export const Route = createFileRoute("/audit-report/$token")({
	component: AuditReportPage,
});
