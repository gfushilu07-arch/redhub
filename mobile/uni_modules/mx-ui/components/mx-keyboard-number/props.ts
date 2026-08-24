import type { PassThroughProps } from "../../types";
import type { MxPopupProps } from "../mx-popup/props";

export type MxKeyboardNumberPassThrough = {
	className?: string;
	item?: PassThroughProps;
	value?: PassThroughProps;
	popup?: MxPopupProps;
};

export type MxKeyboardNumberProps = {
	className?: string;
	pt?: MxKeyboardNumberPassThrough;
	modelValue?: string;
	type?: "number" | "digit" | "idcard";
	title?: string;
	placeholder?: string;
	maxlength?: number;
	confirmText?: string;
	showValue?: boolean;
	inputImmediate?: boolean;
};
