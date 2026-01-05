import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import AutoImport from "unplugin-auto-import/vite";
import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/`
export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"), // 例如 @ 指向 src 目录
		},
	},
	plugins: [
		// Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		monacoEditorEsmPlugin(),
		AutoImport({
			imports: ["react"],
			dts: "@types/auto-imports.d.ts",
		}),
	],
});