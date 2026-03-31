import React from "react";
import { cls } from "@/utils";

export interface MarkdownPreviewProps
	extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

/**
 * 轻量 Markdown 预览组件。
 *
 * 说明: 当前仓库未引入 markdown 解析器，为保证构建可用性，先以纯文本预览为主。
 * 后续若需要真正的 Markdown 渲染，可再引入解析器并在此处替换实现。
 */
export default function MarkdownPreview(props: MarkdownPreviewProps) {
	const { value, className, style, ...rest } = props;

	return (
		<div {...rest} className={cls("markdown-preview", className)} style={style}>
			<pre
				style={{
					margin: 0,
					whiteSpace: "pre-wrap",
					wordBreak: "break-word",
					fontFamily:
						"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
					fontSize: 13,
					lineHeight: 1.6,
				}}
			>
				{value}
			</pre>
		</div>
	);
}
