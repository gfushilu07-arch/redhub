import type { MxFormLabelPosition, MxFormRule, PassThroughProps } from "../../types";
import type { MxTextProps } from "../mx-text/props";

export type MxFormItemPassThrough = {
	className?: string;
	inner?: PassThroughProps;
	label?: MxTextProps;
	content?: PassThroughProps;
	error?: PassThroughProps;
};

export type MxFormItemProps = {
	className?: string;
	pt?: MxFormItemPassThrough;
	label?: string;
	prop?: string;
	rules?: MxFormRule[];
	labelPosition?: MxFormLabelPosition;
	labelWidth?: string | any;
	showAsterisk?: boolean | any;
	showMessage?: boolean | any;
	required?: boolean | any;
};
