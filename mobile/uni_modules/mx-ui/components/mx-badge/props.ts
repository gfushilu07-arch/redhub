import type { PassThroughProps, Type } from "../../types";

export type MxBadgePassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type MxBadgeProps = {
	className?: string;
	pt?: MxBadgePassThrough;
	type?: Type;
	dot?: boolean;
	value?: any;
	position?: boolean;
};
