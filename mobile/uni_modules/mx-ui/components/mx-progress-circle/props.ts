import type { PassThroughProps } from "../../types";

export type MxProgressCirclePassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type MxProgressCircleProps = {
	className?: string;
	pt?: MxProgressCirclePassThrough;
	value?: number;
	size?: number;
	strokeWidth?: number;
	color?: string | any;
	unColor?: string | any;
	showText?: boolean;
	unit?: string;
	startAngle?: number;
	clockwise?: boolean;
	duration?: number;
};
