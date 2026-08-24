import type { PassThroughProps } from "../../types";

export type MxTextareaPassThrough = {
	className?: string;
	inner?: PassThroughProps;
};

export type MxTextareaProps = {
	className?: string;
	pt?: MxTextareaPassThrough;
	modelValue?: string;
	border?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	showWordLimit?: boolean;
	name?: string;
	placeholder?: string;
	placeholderClass?: string;
	placeholderStyle?: string;
	maxlength?: number;
	autofocus?: boolean;
	confirmType?: "done" | "go" | "next" | "search" | "send";
	cursor?: number;
	confirmHold?: boolean;
	height?: any;
	autoHeight?: boolean;
	fixed?: boolean;
	cursorSpacing?: number;
	cursorColor?: string;
	showConfirmBar?: boolean;
	selectionStart?: number;
	selectionEnd?: number;
	adjustPosition?: boolean;
	inputmode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
	holdKeyboard?: boolean;
	disableDefaultPadding?: boolean;
	adjustKeyboardTo?: "cursor" | "bottom";
};
