import type { PassThroughProps } from "../../types";

export type MxTimelineItemPassThrough = {
	className?: string;
	icon?: PassThroughProps;
	title?: PassThroughProps;
	content?: PassThroughProps;
	date?: PassThroughProps;
};

export type MxTimelineItemProps = {
	className?: string;
	pt?: MxTimelineItemPassThrough;
	title?: string;
	icon?: string;
	content?: string;
	date?: string;
	hideLine?: boolean;
};
