import type { MxInputType, PassThroughProps } from "../../types";

export type MxInputOtpPassThrough = {
	className?: string;
	list?: PassThroughProps;
	item?: PassThroughProps;
	cursor?: PassThroughProps;
	value?: PassThroughProps;
};

export type MxInputOtpProps = {
	className?: string;
	pt?: MxInputOtpPassThrough;
	modelValue?: string;
	autofocus?: boolean;
	length?: number;
	disabled?: boolean;
	inputType?: MxInputType;
};
