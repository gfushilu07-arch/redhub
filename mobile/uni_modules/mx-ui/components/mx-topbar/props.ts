import type { PassThroughProps } from "../../types";
import type { MxIconProps } from "../mx-icon/props";

export type MxTopbarPassThrough = {
	className?: string;
	title?: PassThroughProps;
	back?: MxIconProps;
};

export type MxTopbarProps = {
	className?: string;
	pt?: MxTopbarPassThrough;
	title?: string;
	color?: string;
	backgroundColor?: string;
	showBack?: boolean;
	backable?: boolean;
	backPath?: string;
	backIcon?: string;
	safeAreaTop?: boolean;
	fixed?: boolean;
	height?: number | string | any;
};
