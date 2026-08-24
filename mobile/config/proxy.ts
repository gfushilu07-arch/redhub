export const proxy = {
	// 开发环境配置
	dev: {
		// 本地 Rust/Axum 服务
		target: "http://127.0.0.1:8001",
		changeOrigin: true,
		rewrite: (path: string) => path.replace("/dev", "")
	},

	// 生产环境配置
	prod: {
		// RedHub 生产网关
		target: "https://api.redhub.example",
		changeOrigin: true,
		rewrite: (path: string) => path.replace("/prod", "/api")
	}
};

export const value = "dev";
