import type { MxIconProps } from "../mx-icon/props";

export type MxAvatarPassThrough = {
	className?: string;
	icon?: MxIconProps;
};

export type MxAvatarProps = {
	className?: string;
	pt?: MxAvatarPassThrough;
	src?: string;
	size?: number;
	rounded?: boolean;
};
