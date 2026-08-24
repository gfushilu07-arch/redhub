import type { PassThroughProps } from "../../types";

export type MxMarqueePassThrough = {
	className?: string;
	list?: PassThroughProps;
	item?: PassThroughProps;
	image?: PassThroughProps;
};

export type MxMarqueeProps = {
	className?: string;
	pt?: MxMarqueePassThrough;
	list?: string[];
	direction?: "horizontal" | "vertical";
	duration?: number;
	itemHeight?: number;
	itemWidth?: number;
	gap?: number;
};
