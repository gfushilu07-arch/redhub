import type { Justify, PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";
import type { MxImageProps } from "../mx-image/props";
import type { MxTextProps } from "../mx-text/props";

export type MxListItemPassThrough = {
	className?: string;
	wrapper?: PassThroughProps;
	inner?: PassThroughProps;
	label?: MxTextProps;
	content?: PassThroughProps;
	icon?: MxIconProps;
	image?: MxImageProps;
	collapse?: PassThroughProps;
};

export type MxListItemProps = {
	className?: string;
	pt?: MxListItemPassThrough;
	icon?: string;
	image?: string;
	label?: string;
	justify?: Justify;
	arrow?: boolean;
	swipeable?: boolean;
	hoverable?: boolean;
	disabled?: boolean;
	collapse?: boolean;
};
