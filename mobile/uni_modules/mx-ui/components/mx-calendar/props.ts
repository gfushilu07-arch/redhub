import type { MxCalendarDateConfig, MxCalendarMode } from "../../types";

export type MxCalendarPassThrough = {
	className?: string;
};

export type MxCalendarProps = {
	className?: string;
	pt?: MxCalendarPassThrough;
	modelValue?: string | any;
	date?: string[];
	mode?: MxCalendarMode;
	dateConfig?: MxCalendarDateConfig[];
	start?: string;
	end?: string;
	year?: number;
	month?: number;
	showOtherMonth?: boolean;
	showHeader?: boolean;
	showWeeks?: boolean;
	cellHeight?: number;
	cellGap?: number;
	color?: string;
	textColor?: string;
	textOtherMonthColor?: string;
	textDisabledColor?: string;
	textTodayColor?: string;
	textSelectedColor?: string;
	bgSelectedColor?: string;
	bgRangeColor?: string;
};
