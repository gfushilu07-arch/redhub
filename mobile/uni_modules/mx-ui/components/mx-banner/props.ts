import type { PassThroughProps } from "../../types";

export type MxBannerPassThrough = {
	className?: string;
	item?: PassThroughProps;
	itemActive?: PassThroughProps;
	image?: PassThroughProps;
	dots?: PassThroughProps;
	dot?: PassThroughProps;
	dotActive?: PassThroughProps;
};

export type MxBannerProps = {
	className?: string;
	pt?: MxBannerPassThrough;
	list?: string[];
	previousMargin?: number;
	nextMargin?: number;
	autoplay?: boolean;
	interval?: number;
	showDots?: boolean;
	disableTouch?: boolean;
	height?: any;
	imageMode?: string;
};
