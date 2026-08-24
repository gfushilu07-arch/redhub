import type { MxListViewItem, MxListViewGroup, MxListViewVirtualItem, PassThroughProps, MxListViewRefresherStatus } from "../../types";

export type MxListViewPassThrough = {
	className?: string;
	item?: PassThroughProps;
	itemHover?: PassThroughProps;
	list?: PassThroughProps;
	indexBar?: PassThroughProps;
	scroller?: PassThroughProps;
	refresher?: PassThroughProps;
};

export type MxListViewProps = {
	className?: string;
	pt?: MxListViewPassThrough;
	data?: MxListViewItem[];
	itemHeight?: number;
	headerHeight?: number;
	topHeight?: number;
	bottomHeight?: number;
	bufferSize?: number;
	virtual?: boolean;
	scrollIntoView?: string;
	scrollWithAnimation?: boolean;
	showScrollbar?: boolean;
	refresherEnabled?: boolean;
	refresherThreshold?: number;
	refresherBackground?: string;
	refresherDefaultText?: string;
	refresherPullingText?: string;
	refresherRefreshingText?: string;
	showBackTop?: boolean;
};
