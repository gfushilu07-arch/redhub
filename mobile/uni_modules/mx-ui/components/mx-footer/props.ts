import type { PassThroughProps } from "../../types";

export type MxFooterPassThrough = {
	className?: string;
	content?: PassThroughProps;
	wrapper?: PassThroughProps;
};

export type MxFooterProps = {
	className?: string;
	pt?: MxFooterPassThrough;
	minHeight?: number;
	vt?: number;
	height?: number;
	backgroundColor?: string;
};
