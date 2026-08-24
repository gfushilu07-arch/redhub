import type { PassThroughProps } from "../../types";

export type MxLoadmorePassThrough = {
	className?: string;
	icon?: PassThroughProps;
	text?: PassThroughProps;
};

export type MxLoadmoreProps = {
	className?: string;
	pt?: MxLoadmorePassThrough;
	loading?: boolean;
	loadingText?: string;
	finish?: boolean;
	finishText?: string;
	safeAreaBottom?: boolean;
};
