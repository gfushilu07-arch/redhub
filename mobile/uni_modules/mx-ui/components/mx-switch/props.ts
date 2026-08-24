import type { PassThroughProps } from "../../types";
import type { MxLoadingProps } from "../mx-loading/props";

export type MxSwitchPassThrough = {
	className?: string;
	track?: PassThroughProps;
	thumb?: PassThroughProps;
	loading?: MxLoadingProps;
};

export type MxSwitchProps = {
	className?: string;
	pt?: MxSwitchPassThrough;
	modelValue?: boolean;
	disabled?: boolean;
	loading?: boolean;
	height?: number;
	width?: number;
};
