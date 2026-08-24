import type { PassThroughProps } from "../../types";

export type MxCropperPassThrough = {
	className?: string;
	image?: PassThroughProps;
	op?: PassThroughProps;
	opItem?: PassThroughProps;
	mask?: PassThroughProps;
	cropBox?: PassThroughProps;
};

export type MxCropperProps = {
	className?: string;
	pt?: MxCropperPassThrough;
	cropWidth?: number;
	cropHeight?: number;
	maxScale?: number;
	resizable?: boolean;
};
