import type { MxInputType, PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxInputPassThrough = {
	className?: string;
	inner?: PassThroughProps;
	prefixIcon?: MxIconProps;
	suffixIcon?: MxIconProps;
};

export type MxInputProps = {
	className?: string;
	pt?: MxInputPassThrough;
	modelValue?: string;
	type?: MxInputType;
	prefixIcon?: string;
	suffixIcon?: string;
	password?: boolean;
	autofocus?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	placeholder?: string;
	placeholderClass?: string;
	placeholderStyle?: string;
	border?: boolean;
	clearable?: boolean;
	cursorSpacing?: number;
	confirmHold?: boolean;
	confirmType?: "done" | "go" | "next" | "search" | "send";
	adjustPosition?: boolean;
	maxlength?: number;
	holdKeyboard?: boolean;
	precision?: number;
};
