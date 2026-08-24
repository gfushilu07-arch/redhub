import type { PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxImagePassThrough = {
	className?: string;
	inner?: PassThroughProps;
	error?: MxIconProps;
	loading?: PassThroughProps;
};

export type MxImageProps = {
	className?: string;
	pt?: MxImagePassThrough;
	src?: string;
	mode?: "scaleToFill" | "aspectFit" | "aspectFill" | "widthFix" | "heightFix" | "top" | "bottom" | "center" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right";
	border?: boolean;
	preview?: boolean;
	previewList?: string[];
	height?: string | number;
	width?: string | number;
	showLoading?: boolean;
	lazyLoad?: boolean;
	fadeShow?: boolean;
	webp?: boolean;
	showMenuByLongpress?: boolean;
};
