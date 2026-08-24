import type { MxSelectDateShortcut, MxSelectOption } from "../../types";
import type { MxSelectTriggerPassThrough } from "../mx-select-trigger/props";
import type { MxPopupPassThrough } from "../mx-popup/props";

export type MxSelectDatePassThrough = {
	trigger?: MxSelectTriggerPassThrough;
	popup?: MxPopupPassThrough;
};

export type MxSelectDateProps = {
	className?: string;
	pt?: MxSelectDatePassThrough;
	modelValue?: string;
	values?: string[];
	headers?: string[];
	title?: string;
	placeholder?: string;
	showTrigger?: boolean;
	disabled?: boolean;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
	labelFormat?: string;
	valueFormat?: string;
	start?: string;
	end?: string;
	type?: "year" | "month" | "date" | "hour" | "minute" | "second";
	rangeable?: boolean;
	startPlaceholder?: string;
	endPlaceholder?: string;
	rangeSeparator?: string;
	showShortcuts?: boolean;
	shortcuts?: MxSelectDateShortcut[];
};
