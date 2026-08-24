import { type PluginConfig } from "@/.mx";
import { vibrate } from "@/uni_modules/mx-vibrate";

export default {
	install(app: VueApp) {
		uni.$on("mx.vibrate", (duration: number | null) => {
			vibrate(duration ?? 1);
		});
	}
} as PluginConfig;
