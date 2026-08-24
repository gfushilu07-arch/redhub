import type { PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxInputNumberValuePassThrough = {
	className?: string;
	input?: PassThroughProps;
};

export type MxInputNumberOpPassThrough = {
	className?: string;
	minus?: PassThroughProps;
	plus?: PassThroughProps;
	icon?: MxIconProps;
};

export type MxInputNumberPassThrough = {
	className?: string;
	value?: MxInputNumberValuePassThrough;
	op?: MxInputNumberOpPassThrough;
};

export type MxInputNumberProps = {
	className?: string;
	modelValue?: number;
	pt?: MxInputNumberPassThrough;
	placeholder?: string;
	step?: number;
	max?: number;
	min?: number;
	inputType?: "digit" | "number";
	inputable?: boolean;
	disabled?: boolean;
	size?: number | string;
};
