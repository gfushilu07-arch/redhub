import type { PassThroughProps } from "../../types";

export type MxMetricTrend = "up" | "down" | "flat";

export type MxMetricPassThrough = {
	className?: string;
	icon?: PassThroughProps;
	label?: PassThroughProps;
	value?: PassThroughProps;
	trend?: PassThroughProps;
};

export type MxMetricProps = {
	pt?: MxMetricPassThrough;
	label: string;
	value: string | number;
	trend?: string;
	trendType?: MxMetricTrend;
	icon?: string;
	clickable?: boolean;
};
