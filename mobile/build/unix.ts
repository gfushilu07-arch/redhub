import { cool } from "@cool-vue/unix";
import type { Plugin } from "vite";

function mxRuntime(): Plugin {
	return {
		name: "redhub-mx-runtime",
		enforce: "post",
		transform(code) {
			if (!code.includes(".cool")) return null;

			return {
				code: code
					.replaceAll("@/.cool", "@/.mx")
					.replaceAll("./.cool/bootstrap", "./.mx/bootstrap")
					.replaceAll("coolPlugin as __coolPlugin", "mxPlugin as __mxPlugin")
					.replaceAll("__coolPlugin", "__mxPlugin")
					.replaceAll("./.cool", "./.mx"),
				map: null
			};
		}
	};
}

export function mx(options?: Parameters<typeof cool>[0]) {
	const upstream = cool(options);
	return [upstream, mxRuntime()].flat();
}
