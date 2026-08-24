import type { MxTreeItem, PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxTreeItemPassThrough = {
	item?: PassThroughProps;
	itemChecked?: PassThroughProps;
	itemWrapper?: PassThroughProps;
	expand?: PassThroughProps;
	expandIcon?: MxIconProps;
	checkbox?: PassThroughProps;
	checkedIcon?: MxIconProps;
	halfCheckedIcon?: MxIconProps;
	uncheckedIcon?: MxIconProps;
	label?: PassThroughProps;
};

export type MxTreeItemProps = {
	className?: string;
	pt?: MxTreeItemPassThrough;
	item?: MxTreeItem;
	level?: number;
};
