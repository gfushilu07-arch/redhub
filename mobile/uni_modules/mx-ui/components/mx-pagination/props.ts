import type { PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxPaginationPassThrough = {
	className?: string;
	item?: PassThroughProps;
	itemText?: PassThroughProps;
	prev?: PassThroughProps;
	prevIcon?: MxIconProps;
	next?: PassThroughProps;
	nextIcon?: MxIconProps;
};

export type MxPaginationProps = {
	className?: string;
	pt?: MxPaginationPassThrough;
	modelValue?: number;
	total?: number;
	size?: number;
};
