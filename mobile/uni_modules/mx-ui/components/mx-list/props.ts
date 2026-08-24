import type { MxListItem, PassThroughProps } from "../../types";
import type { MxListItemPassThrough } from "../mx-list-item/props";

export type MxListPassThrough = {
	className?: string;
	list?: PassThroughProps;
	item?: MxListItemPassThrough;
};

export type MxListProps = {
	className?: string;
	pt?: MxListPassThrough;
	list?: MxListItem[];
	border?: boolean;
};
