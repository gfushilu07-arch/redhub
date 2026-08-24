import type { MxIconProps } from "../mx-icon/props";

export type MxLoadingPassThrough = {
	className?: string;
	icon?: MxIconProps;
};

export type MxLoadingProps = {
	className?: string;
	pt?: MxLoadingPassThrough;
	loading?: boolean;
	size?: number;
	color?: string;
};
