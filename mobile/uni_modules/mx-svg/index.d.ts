export {};

declare module "vue" {
	export interface GlobalComponents {
		"mx-svg": (typeof import("./components/mx-svg/mx-svg.uvue"))["default"];
	}
}

declare module "@/uni_modules/mx-svg" {
	export class MxSvg {
		constructor(element: UniNativeViewElement): void;
		load(src: string, color: string): void;
	}
}
