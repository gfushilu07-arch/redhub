import type { MxSelectTriggerPassThrough } from "../mx-select-trigger/props";
import type { MxPopupPassThrough } from "../mx-popup/props";
import type { MxListViewItem } from "../../types";

export type MxCascaderPassThrough = {
	trigger?: MxSelectTriggerPassThrough;
	popup?: MxPopupPassThrough;
};

export type MxCascaderProps = {
	className?: string;
	pt?: MxCascaderPassThrough;
	modelValue?: string[];
	title?: string;
	placeholder?: string;
	options?: MxListViewItem[];
	showTrigger?: boolean;
	disabled?: boolean;
	labelKey?: string;
	valueKey?: string;
	textSeparator?: string;
	height?: any;
};
