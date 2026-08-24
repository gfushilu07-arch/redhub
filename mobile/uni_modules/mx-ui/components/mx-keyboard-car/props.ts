import type { PassThroughProps } from "../../types";
import type { MxPopupProps } from "../mx-popup/props";

export type MxKeyboardCarPassThrough = {
	className?: string;
	item?: PassThroughProps;
	value?: PassThroughProps;
	popup?: MxPopupProps;
};

export type MxKeyboardCarProps = {
	className?: string;
	pt?: MxKeyboardCarPassThrough;
	modelValue?: string;
	title?: string;
	placeholder?: string;
	maxlength?: number;
	showValue?: boolean;
	inputImmediate?: boolean;
};
