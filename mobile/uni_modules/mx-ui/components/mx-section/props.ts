import type { PassThroughProps } from "../../types";

export type MxSectionPassThrough = {
	className?: string;
	header?: PassThroughProps;
	title?: PassThroughProps;
	description?: PassThroughProps;
	action?: PassThroughProps;
};

export type MxSectionProps = {
	pt?: MxSectionPassThrough;
	title?: string;
	description?: string;
};
