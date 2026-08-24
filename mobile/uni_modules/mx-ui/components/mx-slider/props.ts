import type { PassThroughProps } from "../../types";

export type MxSliderPassThrough = {
	className?: string;
	track?: PassThroughProps;
	progress?: PassThroughProps;
	thumb?: PassThroughProps;
	value?: PassThroughProps;
};

export type MxSliderProps = {
	className?: string;
	pt?: MxSliderPassThrough;
	modelValue?: number;
	values?: number[];
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	blockSize?: number;
	trackHeight?: number;
	showValue?: boolean;
	range?: boolean;
};
