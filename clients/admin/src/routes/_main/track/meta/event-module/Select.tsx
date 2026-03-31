import { TrackMetaEventInfo } from "@cms/api-interface";
import { useRequest } from "ahooks";
import { RefSelectProps, Select, SelectProps } from "antd";
import { forwardRef } from "react";
import { getListApi } from "./services";

interface Opt {
	label: string;
	value: string;
	data: TrackMetaEventInfo;
}
export const TrackEventSelect = forwardRef<
	RefSelectProps,
	SelectProps<string, Opt> & {
		onSelect?: (v: string, option?: Opt | Opt[]) => void;
	}
>((props, ref) => {
	const { data: options } = useRequest(() => {
		return getListApi({ current: 1, page_size: 100 }).then((res) =>
			res.data.data.list.map((d) => ({
				data: d,
				label: d.cname,
				value: d.name,
			})),
		);
	});
	return (
		<Select<string, Opt>
			{...props}
			ref={ref}
			options={options}
			onChange={(value, option) => {
				props.onChange?.(value, option);
				props.onSelect?.(value, option);
			}}
		/>
	);
});
