import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		cssTarget: 'chrome100', // Запрещает esbuild превращать стандартный CSS в устаревшие префиксы
	},
})