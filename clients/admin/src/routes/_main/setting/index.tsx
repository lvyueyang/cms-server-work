import { createFileRoute } from "@tanstack/react-router";
import { Button, Card } from "antd";
import { message } from "@/utils/notice";
import { initRenderViewGlobalDataApi } from "./module";

export default function SettingPage() {
	return (
		<div
			style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)" }}
		>
			<Card
				title="重载模板引擎全局数据"
				extra={
					<Button
						type="primary"
						onClick={() => {
							initRenderViewGlobalDataApi().then(() => {
								message.success("重载成功");
							});
						}}
					>
						重载
					</Button>
				}
			>
				点击重载按钮，会重新加载所有模板引擎全局数据。
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/_main/setting/")({
	component: SettingPage,
});
