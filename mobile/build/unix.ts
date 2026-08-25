import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cool } from "@cool-vue/unix";
import type { Plugin } from "vite";

function readJson<T>(path: string, fallback: T): T {
	try {
		return JSON.parse(readFileSync(path, "utf8")) as T;
	} catch (_error) {
		return fallback;
	}
}

function readPalette(source: string, paletteName: string, prefix: string): Record<string, string> {
	const match = new RegExp(
		`name:\\s*["']${paletteName}["'][\\s\\S]*?palette:\\s*\\{([\\s\\S]*?)\\n\\s*\\}\\s*,?`
	).exec(source);
	if (match == null) return {};

	const result: Record<string, string> = {};
	const entries = match[1].matchAll(/(\d+):\s*["']([^"']+)["']/g);
	for (const entry of entries) {
		const key = entry[1];
		const value = entry[2];
		if (key != null && value != null) {
			result[prefix == "surface" && key == "0" ? "surface" : `${prefix}-${key}`] = value;
		}
	}

	return result;
}

function readTailwindColors(root: string): Record<string, string> {
	try {
		const source = readFileSync(join(root, "tailwind.config.ts"), "utf8");
		return {
			...readPalette(source, "crimson", "primary"),
			...readPalette(source, "zinc", "surface")
		};
	} catch (_error) {
		return {};
	}
}

function mxContext(): Plugin {
	let projectRoot = process.cwd();

	return {
		name: "redhub-mx-context",
		enforce: "pre",
		configResolved(config) {
			projectRoot = config.root;
		},
		transform(code, id) {
			const normalizedId = id.replaceAll("\\", "/");
			if (!normalizedId.includes("/.mx/ctx/index.ts")) return null;

			const pages = readJson<Record<string, any>>(join(projectRoot, "pages.json"), {});
			const manifest = readJson<Record<string, any>>(join(projectRoot, "manifest.json"), {});
			const theme = readJson<Record<string, any>>(join(projectRoot, "theme.json"), {});
			const context = {
				...pages,
				appid: manifest.appid ?? "",
				theme,
				color: readTailwindColors(projectRoot),
				subPackages: pages.subPackages ?? [],
				tabBar: pages.tabBar ?? {},
				uniIdRouter: pages.uniIdRouter ?? {}
			};

			let contextCode = JSON.stringify(context, null, 4);
			contextCode = contextCode.replace(`"tabBar": {}`, `"tabBar": {} as TabBar`);
			contextCode = contextCode.replace(`"subPackages": []`, `"subPackages": [] as SubPackage[]`);

			return {
				code: code.replace(
					"const ctx = parse<Ctx>({})!",
					`const ctx = parse<Ctx>(${contextCode})!`
				),
				map: { mappings: "" }
			};
		}
	};
}

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
	return [upstream, mxContext(), mxRuntime()].flat();
}
