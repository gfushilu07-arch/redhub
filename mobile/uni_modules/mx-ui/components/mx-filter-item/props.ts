import type { PassThroughProps, MxFilterItemType, MxSelectOption } from "../../types";

export type MxFilterItemPassThrough = {
	className?: string;
	label?: PassThroughProps;
};

export type MxFilterItemProps = {
	className?: string;
	pt?: MxFilterItemPassThrough;
	label?: string;
	value: any;
	type?: MxFilterItemType;
	options?: MxSelectOption[];
};
