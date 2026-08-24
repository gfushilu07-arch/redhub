declare type ComponentPublicInstance = any;

declare type MxInputComponentPublicInstance = {
	isFocus: boolean;
	focus: () => void;
	clear: () => void;
};

declare type MxTextareaComponentPublicInstance = {
	isFocus: boolean;
	focus: () => void;
};

declare type MxPopupComponentPublicInstance = {
	isOpened: boolean;
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

declare type MxSelectComponentPublicInstance = {
	open: (cb: ((value: any) => void) | null) => void;
	close: () => void;
};

declare type MxSelectDateComponentPublicInstance = {
	open: (cb: ((value: string) => void) | null) => void;
	close: () => void;
	setValue: (value: string) => void;
	setValues: (values: string[]) => void;
	clear: () => void;
	setRange: (index: number) => void;
	confirm: () => void;
};

declare type MxSelectTimeComponentPublicInstance = {
	open: (cb: ((value: string) => void) | null) => void;
	close: () => void;
};

declare type MxRowComponentPublicInstance = {
	gutter: number;
};

declare type MxConfirmComponentPublicInstance = {
	open: (options: {
		title: string;
		message: string;
		confirmText?: string;
		showConfirm?: boolean;
		cancelText?: string;
		showCancel?: boolean;
	}) => void;
	close: () => void;
};

declare type MxActionSheetComponentPublicInstance = {
	open: (options: {
		title?: string;
		list: {
			label: string;
			icon?: string;
			disabled?: boolean;
			color?: string;
			callback?: () => void;
		}[];
		cancelText?: string;
		showCancel?: boolean;
	}) => void;
	close: () => void;
};

declare type MxToastComponentPublicInstance = {
	open: (options: {
		message: string;
		duration?: number;
		icon?: string;
		position?: "top" | "center" | "bottom";
	}) => void;
	close: () => void;
};

declare type MxKeyboardNumberComponentPublicInstance = {
	open: () => void;
	close: () => void;
};

declare type MxKeyboardCarComponentPublicInstance = {
	open: () => void;
	close: () => void;
};

declare type MxKeyboardPasswordComponentPublicInstance = {
	open: () => void;
	close: () => void;
};

declare type MxPaginationComponentPublicInstance = {
	prev: () => void;
	next: () => void;
};

declare type MxCollapseComponentPublicInstance = {
	show: () => void;
	hide: () => void;
	toggle: () => void;
};

declare type MxCountdownComponentPublicInstance = {
	next: () => void;
	start: () => void;
	stop: () => void;
	done: () => void;
	isRunning: boolean;
};

declare type MxStickyComponentPublicInstance = {
	getRect: () => void;
};

declare type MxListIndexComponentPublicInstance = {
	scrollToIndex: (index: string) => void;
};

declare type MxListItemComponentPublicInstance = {
	resetSwipe: () => void;
	initSwipe: () => void;
};

declare type MxListItem = {
	label: string;
	content?: string;
	icon?: string;
	arrow?: boolean;
	hoverable?: boolean;
	disabled?: boolean;
};

declare type MxListViewItem = {
	label?: string;
	value?: any;
	index?: string;
	children?: MxListViewItem[];
};

declare type MxListViewComponentPublicInstance = {
	data: MxListViewItem[];
	stopRefresh: () => void;
};

declare type MxCascaderComponentPublicInstance = {
	open: () => void;
	close: () => void;
	reset: () => void;
	clear: () => void;
};

declare type MxWaterfallComponentPublicInstance = {
	append: (data: UTSJSONObject[]) => Promise<void>;
	remove: (id: string | number) => void;
	update: (id: string | number, data: UTSJSONObject) => void;
	clear: () => void;
};

declare type MxQrcodeComponentPublicInstance = {
	toPng: () => Promise<string>;
};

declare type MxProgressCircleComponentPublicInstance = {
	animate: (value: number) => void;
};

declare type MxSignComponentPublicInstance = {
	clear: () => void;
	toPng: () => Promise<string>;
};

declare type MxCropperComponentPublicInstance = {
	open: (url: string) => void;
	close: () => void;
	chooseImage: () => void;
	toPng: () => Promise<string>;
};

declare type MxFormRule = {
	required?: boolean;
	message?: string;
	min?: number;
	max?: number;
	pattern?: RegExp;
	validator?: (value: any | null) => boolean | string;
};

declare type MxFormValidateError = {
	field: string;
	message: string;
};

declare type MxFormComponentPublicInstance = {
	labelPosition: "left" | "top" | "right";
	labelWidth: string;
	showAsterisk: boolean;
	showMessage: boolean;
	disabled: boolean;
	data: UTSJSONObject;
	errors: Map<string, string>;
	fields: Set<string>;
	addField: (prop: string, rules: MxFormRule[]) => void;
	removeField: (prop: string) => void;
	getValue: (prop: string) => any | null;
	setError: (prop: string, error: string) => void;
	getError: (prop: string) => string;
	getErrors: () => Promise<MxFormValidateError[]>;
	removeError: (prop: string) => void;
	clearErrors: () => void;
	getRule: (prop: string) => MxFormRule[];
	setRule: (prop: string, rules: MxFormRule[]) => void;
	removeRule: (prop: string) => void;
	validateRule: (value: any | null, rule: MxFormRule) => string | null;
	clearValidate: () => void;
	validateField: (prop: string) => string | null;
	validate: (callback: (valid: boolean, errors: MxFormValidateError[]) => void) => Promise<void>;
};

declare type MxFormItemComponentPublicInstance = {
	prop: string;
	isError: boolean;
};

declare type MxPageComponentPublicInstance = {
	scrollTop: number;
	scrollTo: (top: number) => void;
	scrollToTop: () => void;
};

declare type MxSlideVerifyComponentPublicInstance = {
	init: () => void;
	reset: () => void;
};

declare type MxTreeComponentPublicInstance = {
	icon: string;
	expandIcon: string;
	checkable: boolean;
	multiple: boolean;
	checkStrictly: boolean;
	clearChecked: () => void;
	setChecked: (key: string | number, flag: boolean) => void;
	setCheckedKeys: (keys: (string | number)[]) => void;
	getCheckedKeys: () => (string | number)[];
	getHalfCheckedKeys: () => (string | number)[];
	setExpanded: (key: string | number, flag: boolean) => void;
	setExpandedKeys: (keys: (string | number)[]) => void;
	getExpandedKeys: () => (string | number)[];
	expandAll: () => void;
	collapseAll: () => void;
};

declare type MxCalendarComponentPublicInstance = {
	open(cb: ((value: string | string[]) => void) | null = null): void;
	close(): void;
};

declare type MxMarqueeComponentPublicInstance = {
	play(): void;
	pause(): void;
	start(): void;
	stop(): void;
	reset(): void;
};

declare type MxReadMoreComponentPublicInstance = {
	toggle(): void;
	getContentHeight(): void;
};

declare type MxSelectSeatComponentPublicInstance = {
	setSeat: (row: number, col: number, data: UTSJSONObject) => void;
	getSeats: () => {
		row: number;
		col: number;
		disabled?: boolean;
		empty?: boolean;
		bgColor?: string;
		borderColor?: string;
		selectedBgColor?: string;
		selectedColor?: string;
		selectedIcon?: string;
		icon?: string;
		image?: string;
		selectedImage?: string;
	}[];
	draw: () => void;
};
