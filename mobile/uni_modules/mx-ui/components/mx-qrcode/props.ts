import type { QrcodeOptions } from "./draw";
import type { MxQrcodeMode } from "../../types";

export type MxQrcodeProps = {
	className?: string;
	width?: number;
	height?: number;
	foreground?: string;
	background?: string;
	pdColor?: string | any;
	pdRadius?: number;
	text?: string;
	logo?: string;
	logoSize?: number;
	padding?: number;
	mode?: MxQrcodeMode;
};
