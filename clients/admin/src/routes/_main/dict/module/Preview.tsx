import { LinkOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Space, Tooltip } from "antd";
import { dictStore, useDictStore } from "@/store/dict";

type DictPreviewProps = { type: string; value: string };
export const DictPreview = (props: DictPreviewProps) => {
	const dictStore = useDictStore();
	const currentType = dictStore.list?.find((o) => o.type === props.type);
	const currentValue = currentType?.values.find((d) => d.value === props.value);
	return (
		<Space>
			<Tooltip title={currentValue?.value}>
				<span>{currentValue?.label}</span>
			</Tooltip>
			{currentType?.id ? (
				<Link to="/dict/$id" params={{ id: String(currentType.id) }}>
					<LinkOutlined />
				</Link>
			) : null}
		</Space>
	);
};

export const getDictLabel = (type: string, value: string) => {
	const currentType = dictStore()?.list?.find((o) => o.type === type);
	return currentType?.values.find((d) => d.value === value)?.label;
};
