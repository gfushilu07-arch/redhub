import type { MxCalendarDateConfig, MxCalendarMode } from "../../types";
import type { MxSelectTriggerPassThrough } from "../mx-select-trigger/props";
import type { MxPopupPassThrough } from "../mx-popup/props";

export type MxCalendarSelectPassThrough = {
	trigger?: MxSelectTriggerPassThrough;
	popup?: MxPopupPassThrough;
};

export type MxCalendarSelectProps = {
	className?: string;
	pt?: MxCalendarSelectPassThrough;
	modelValue?: string | any;
	date?: string[];
	mode?: MxCalendarMode;
	dateConfig?: MxCalendarDateConfig[];
	start?: string;
	end?: string;
	title?: string;
	placeholder?: string;
	showTrigger?: boolean;
	disabled?: boolean;
	splitor?: string;
	rangeSplitor?: string;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
};
