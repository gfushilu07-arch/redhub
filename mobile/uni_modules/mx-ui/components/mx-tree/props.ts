import type { MxTreeItem, MxTreeNodeInfo } from "../../types";

export type MxTreePassThrough = {
	className?: string;
};

export type MxTreeProps = {
	className?: string;
	pt?: MxTreePassThrough;
	modelValue?: any | any;
	list?: MxTreeItem[];
	icon?: string;
	expandIcon?: string;
	checkStrictly?: boolean;
	checkable?: boolean;
	multiple?: boolean;
};
