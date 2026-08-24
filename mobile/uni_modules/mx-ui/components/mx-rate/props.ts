import type { PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxRatePassThrough = {
	className?: string;
	item?: PassThroughProps;
	icon?: MxIconProps;
	score?: PassThroughProps;
};

export type MxRateProps = {
	className?: string;
	pt?: MxRatePassThrough;
	modelValue?: number;
	max?: number;
	disabled?: boolean;
	allowHalf?: boolean;
	showScore?: boolean;
	size?: number;
	icon?: string;
	voidIcon?: string;
	color?: string;
	voidColor?: string;
};
