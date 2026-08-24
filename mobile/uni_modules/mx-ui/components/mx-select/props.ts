import type { MxSelectOption, MxSelectValue } from "../../types";
import type { MxSelectTriggerPassThrough } from "../mx-select-trigger/props";
import type { MxPopupPassThrough } from "../mx-popup/props";

export type MxSelectPassThrough = {
	trigger?: MxSelectTriggerPassThrough;
	popup?: MxPopupPassThrough;
};

export type MxSelectProps = {
	className?: string;
	pt?: MxSelectPassThrough;
	modelValue?: MxSelectValue;
	title?: string;
	placeholder?: string;
	options?: MxSelectOption[];
	showTrigger?: boolean;
	disabled?: boolean;
	columnCount?: number;
	splitor?: string;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
};
