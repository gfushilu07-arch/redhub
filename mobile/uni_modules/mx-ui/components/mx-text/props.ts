import type { MxTextType } from "../../types";

export type MxTextPassThrough = {
	className?: string;
};

export type MxTextProps = {
	className?: string;
	pt?: MxTextPassThrough;
	value?: string | number | any;
	color?: string;
	size?: number;
	type?: MxTextType;
	mask?: boolean;
	currency?: string;
	precision?: number;
	maskStart?: number;
	maskEnd?: number;
	maskChar?: string;
	ellipsis?: boolean;
	lines?: number;
	selectable?: boolean;
	space?: "ensp" | "emsp" | "nbsp";
	decode?: boolean;
	preWrap?: boolean;
};
