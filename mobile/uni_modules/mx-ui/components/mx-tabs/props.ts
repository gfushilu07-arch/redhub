import type { MxTabsItem, PassThroughProps } from "../../types";

export type MxTabsPassThrough = {
	className?: string;
	text?: PassThroughProps;
	item?: PassThroughProps;
	line?: PassThroughProps;
	slider?: PassThroughProps;
};

export type MxTabsProps = {
	className?: string;
	pt?: MxTabsPassThrough;
	modelValue?: string | number;
	height?: string | number;
	list?: MxTabsItem[];
	fill?: boolean;
	gutter?: number;
	color?: string;
	unColor?: string;
	showLine?: boolean;
	showSlider?: boolean;
	disabled?: boolean;
};
