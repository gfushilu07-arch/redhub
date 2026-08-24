import type { PassThroughProps } from "../../types";

export type MxNoticebarPassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type MxNoticebarProps = {
	className?: string;
	pt?: MxNoticebarPassThrough;
	text?: string | string[];
	direction?: "horizontal" | "vertical";
	duration?: number;
	speed?: number;
	height?: string | number;
};
