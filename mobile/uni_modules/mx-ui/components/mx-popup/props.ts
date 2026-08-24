import type { MxPopupDirection, PassThroughProps } from "../../types";

export type MxPopupHeaderPassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type MxPopupPassThrough = {
	className?: string;
	inner?: PassThroughProps;
	header?: MxPopupHeaderPassThrough;
	container?: PassThroughProps;
	mask?: PassThroughProps;
	draw?: PassThroughProps;
};

export type MxPopupProps = {
	className?: string;
	pt?: MxPopupPassThrough;
	modelValue?: boolean;
	title?: string;
	direction?: MxPopupDirection;
	size?: any;
	showHeader?: boolean;
	showClose?: boolean;
	showMask?: boolean;
	maskClosable?: boolean;
	swipeClose?: boolean;
	swipeCloseThreshold?: number;
	pointerEvents?: "auto" | "none";
	keepAlive?: boolean;
	enablePortal?: boolean;
};
