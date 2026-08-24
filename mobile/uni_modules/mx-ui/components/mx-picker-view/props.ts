import type { MxSelectOption } from "../../types";

export type MxSelectPickerViewProps = {
	className?: string;
	headers?: string[];
	value?: number[];
	columns?: MxSelectOption[][];
	itemHeight?: number;
	height?: number;
};
