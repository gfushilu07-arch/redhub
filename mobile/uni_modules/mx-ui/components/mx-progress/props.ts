import type { PassThroughProps } from "../../types";

export type MxProgressPassThrough = {
	className?: string;
	outer?: PassThroughProps;
	inner?: PassThroughProps;
	text?: PassThroughProps;
};

export type MxProgressProps = {
	className?: string;
	pt?: MxProgressPassThrough;
	value?: number;
	strokeWidth?: number;
	showText?: boolean;
	color?: string;
	unColor?: string;
};
