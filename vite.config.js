import fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

function getHtmlInputs(dir = __dirname, entries = {}) {
	const files = fs.readdirSync(dir, { withFileTypes: true })

	for (const file of files) {
		if (file.isDirectory()) {
			if (!['node_modules', 'dist', '.git', '.github'].includes(file.name)) {
				getHtmlInputs(resolve(dir, file.name), entries)
			}
		} else if (file.isFile() && file.name.endsWith('.html')) {
			const fullPath = resolve(dir, file.name)
			const entryName = fullPath
				.replace(__dirname, '')
				.replace(/^[/\\]/, '')
				.replace(/[/\\]/g, '_')
				.replace('.html', '')

			entries[entryName] = fullPath
		}
	}

	return entries
}

export default defineConfig({
	build: {
		rollupOptions: {
			input: getHtmlInputs(),
		},
	},
})