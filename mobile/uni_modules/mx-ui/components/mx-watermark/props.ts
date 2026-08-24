import type { PassThroughProps } from "../../types";

export type MxWatermarkPassThrough = {
	className?: string;
	container?: PassThroughProps;
};

export type MxWatermarkProps = {
	className?: string;
	pt?: MxWatermarkPassThrough;
	text?: string;
	fontSize?: number;
	color?: string;
	darkColor?: string;
	opacity?: number;
	rotate?: number;
	width?: number;
	height?: number;
	gapX?: number;
	gapY?: number;
	zIndex?: number;
	fontWeight?: string;
	fontFamily?: string;
};
