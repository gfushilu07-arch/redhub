import type { MxFormLabelPosition, MxFormRule, MxFormValidateError } from "../../types";

export type MxFormPassThrough = {
	className?: string;
};

export type MxFormProps = {
	className?: string;
	pt?: MxFormPassThrough;
	modelValue?: any;
	rules?: Map<string, MxFormRule[]>;
	labelPosition?: MxFormLabelPosition;
	labelWidth?: string;
	showAsterisk?: boolean;
	showMessage?: boolean;
	disabled?: boolean;
	scrollToError?: boolean;
};
