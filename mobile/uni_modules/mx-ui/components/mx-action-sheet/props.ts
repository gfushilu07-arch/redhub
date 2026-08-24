import type { MxActionSheetItem, MxActionSheetOptions, PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxActionSheetPassThrough = {
	className?: string;
	item?: PassThroughProps;
	list?: PassThroughProps;
	icon?: MxIconProps;
};

export type MxActionSheetProps = {
	className?: string;
	pt?: MxActionSheetPassThrough;
};
