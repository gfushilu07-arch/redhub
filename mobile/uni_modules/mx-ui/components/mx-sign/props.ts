export type MxSignPassThrough = {
	className?: string;
};

export type MxSignProps = {
	className?: string;
	pt?: MxSignPassThrough;
	width?: number;
	height?: number;
	strokeColor?: string;
	strokeWidth?: number;
	backgroundColor?: string;
	enableBrush?: boolean;
	minStrokeWidth?: number;
	maxStrokeWidth?: number;
	velocitySensitivity?: number;
};
