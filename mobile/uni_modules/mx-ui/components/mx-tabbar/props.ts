import type { MxTabbarItem, PassThroughProps } from "../../types";
import type { MxTextProps } from "../mx-text/props";
import type { MxImageProps } from "../mx-image/props";

export type MxTabbarPassThrough = {
	className?: string;
	item?: PassThroughProps;
	icon?: MxImageProps;
	text?: MxTextProps;
	footer?: PassThroughProps;
	footerContent?: PassThroughProps;
};

export type MxTabbarProps = {
	className?: string;
	modelValue?: string;
	pt?: MxTabbarPassThrough;
	list?: MxTabbarItem[];
	height?: number;
	backgroundColor?: string;
	color?: string;
	selectedColor?: string;
	iconSize?: number;
	textSize?: number;
	showIcon?: boolean;
	showText?: boolean;
};
