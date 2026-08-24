declare type MxCanvasComponentPublicInstance = {
	saveImage: () => void;
	previewImage: () => void;
	createImage: () => Promise<string>;
};
