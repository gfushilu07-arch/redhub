import type { MxSelectOption } from "../../types";
import type { MxSelectTriggerPassThrough } from "../mx-select-trigger/props";
import type { MxPopupPassThrough } from "../mx-popup/props";

export type MxSelectTimePassThrough = {
	trigger?: MxSelectTriggerPassThrough;
	popup?: MxPopupPassThrough;
};

export type MxSelectTimeProps = {
	className?: string;
	pt?: MxSelectTimePassThrough;
	modelValue?: string;
	headers?: string[];
	type?: "hour" | "minute" | "second";
	title?: string;
	placeholder?: string;
	showTrigger?: boolean;
	disabled?: boolean;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
	labelFormat?: string | any;
};
