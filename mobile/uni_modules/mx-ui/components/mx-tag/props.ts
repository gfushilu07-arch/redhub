import type { PassThroughProps, Type } from "../../types";

export type MxTagPassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type MxTagProps = {
	className?: string;
	pt?: MxTagPassThrough;
	type?: Type;
	icon?: string;
	rounded?: boolean;
	closable?: boolean;
	plain?: boolean;
};
