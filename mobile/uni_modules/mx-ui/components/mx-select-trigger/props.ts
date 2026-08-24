import type { MxIconProps } from "../mx-icon/props";
import type { PassThroughProps } from "../../types";
import type { MxTextProps } from "../mx-text/props";

export type MxSelectTriggerPassThrough = {
	className?: string;
	icon?: MxIconProps;
	placeholder?: PassThroughProps;
	text?: MxTextProps;
};

export type MxSelectTriggerProps = {
	className?: string;
	pt?: MxSelectTriggerPassThrough;
	text?: string;
	placeholder?: string;
	arrowIcon?: string;
	disabled?: boolean;
	focus?: boolean;
};
