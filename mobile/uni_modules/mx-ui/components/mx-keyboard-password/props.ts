import type { PassThroughProps } from "../../types";
import type { MxPopupProps } from "../mx-popup/props";

export type MxKeyboardPasswordPassThrough = {
	className?: string;
	item?: PassThroughProps;
	value?: PassThroughProps;
	popup?: MxPopupProps;
};

export type MxKeyboardPasswordProps = {
	className?: string;
	pt?: MxKeyboardPasswordPassThrough;
	modelValue?: string;
	title?: string;
	placeholder?: string;
	minlength?: number;
	maxlength?: number;
	confirmText?: string;
	showValue?: boolean;
	inputImmediate?: boolean;
	encrypt?: boolean;
};
