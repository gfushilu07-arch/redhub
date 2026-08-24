import type { PassThroughProps } from "../../types";

export type MxSkeletonPassThrough = {
	className?: string;
	loading?: PassThroughProps;
};

export type MxSkeletonProps = {
	className?: string;
	pt?: MxSkeletonPassThrough;
	loading?: boolean;
	type?: "text" | "image" | "circle" | "button";
};
