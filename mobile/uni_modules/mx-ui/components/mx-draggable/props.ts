import type { PassThroughProps } from "../../types";

export type MxDraggablePassThrough = {
	className?: string;
	ghost?: PassThroughProps;
};

export type MxDraggableProps = {
	className?: string;
	pt?: MxDraggablePassThrough;
	modelValue?: UTSJSONObject[];
	disabled?: boolean;
	columns?: number;
	longPress?: boolean;
};
