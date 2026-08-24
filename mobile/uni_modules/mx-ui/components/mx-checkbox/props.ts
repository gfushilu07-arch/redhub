import type { MxIconProps } from "../mx-icon/props";
import type { MxTextProps } from "../mx-text/props";

export type MxCheckboxPassThrough = {
	className?: string;
	icon?: MxIconProps;
	label?: MxTextProps;
};

export type MxCheckboxProps = {
	className?: string;
	pt?: MxCheckboxPassThrough;
	modelValue?: any[] | boolean;
	label?: string;
	value?: any;
	disabled?: boolean;
	activeIcon?: string;
	inactiveIcon?: string;
	showIcon?: boolean;
};
