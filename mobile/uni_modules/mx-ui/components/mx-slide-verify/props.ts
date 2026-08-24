import type { PassThroughProps } from "../../types";

export type MxSlideVerifyPassThrough = {
	className?: string;
	track?: PassThroughProps;
	image?: PassThroughProps;
	progress?: PassThroughProps;
	slider?: PassThroughProps;
	icon?: PassThroughProps;
	text?: PassThroughProps;
	label?: PassThroughProps;
};

export type MxSlideVerifyProps = {
	className?: string;
	pt?: MxSlideVerifyPassThrough;
	modelValue?: boolean;
	mode?: "slide" | "image";
	size?: number;
	disabled?: boolean;
	imageUrl?: string;
	imageSize?: any;
	angleThreshold?: number;
	text?: string;
	successText?: string;
	showFail?: boolean;
	failText?: string;
};
