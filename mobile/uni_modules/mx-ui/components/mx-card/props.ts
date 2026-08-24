import type { PassThroughProps } from "../../types";

export type MxCardPassThrough = {
	className?: string;
	header?: PassThroughProps;
	title?: PassThroughProps;
	subtitle?: PassThroughProps;
	extra?: PassThroughProps;
	body?: PassThroughProps;
	footer?: PassThroughProps;
};

export type MxCardProps = {
	pt?: MxCardPassThrough;
	title?: string;
	subtitle?: string;
	bordered?: boolean;
	shadow?: boolean;
	padded?: boolean;
};
