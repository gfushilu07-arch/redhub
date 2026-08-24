import type { MxUploadItem, PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";
import type { MxTextProps } from "../mx-text/props";

export type MxUploadPassThrough = {
	className?: string;
	item?: PassThroughProps;
	add?: PassThroughProps;
	image?: PassThroughProps;
	icon?: MxIconProps;
	text?: MxTextProps;
};

export type MxUploadProps = {
	className?: string;
	pt?: MxUploadPassThrough;
	modelValue?: string[] | string;
	icon?: string;
	text?: string;
	sizeType?: string[] | string;
	sourceType?: string[];
	height?: any;
	width?: any;
	multiple?: boolean;
	limit?: number;
	disabled?: boolean;
	test?: boolean;
};
