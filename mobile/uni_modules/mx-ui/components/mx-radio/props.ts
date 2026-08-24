import type { MxIconProps } from "../mx-icon/props";
import type { MxTextProps } from "../mx-text/props";

export type MxRadioPassThrough = {
	className?: string;
	icon?: MxIconProps;
	label?: MxTextProps;
};

export type MxRadioProps = {
	className?: string;
	pt?: MxRadioPassThrough;
	modelValue?: any;
	activeIcon?: string;
	inactiveIcon?: string;
	showIcon?: boolean;
	label?: string;
	value?: any;
	disabled?: boolean;
};
