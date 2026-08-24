import type { PassThroughProps } from "../../types";

export type MxCountdownPassThrough = {
	className?: string;
	text?: PassThroughProps;
	splitor?: PassThroughProps;
};

export type MxCountdownProps = {
	className?: string;
	pt?: MxCountdownPassThrough;
	format?: string;
	hideZero?: boolean;
	day?: number;
	hour?: number;
	minute?: number;
	second?: number;
	datetime?: Date | string;
	auto?: boolean;
};
