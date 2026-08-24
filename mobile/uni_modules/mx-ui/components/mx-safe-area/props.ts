export type MxSafeAreaPassThrough = {
	className?: string;
};

export type MxSafeAreaProps = {
	className?: string;
	pt?: MxSafeAreaPassThrough;
	type?: "top" | "bottom";
	transparent?: boolean;
};
