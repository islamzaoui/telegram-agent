import { defineConfig } from 'bunup';
import process from 'node:process';

const glob = new Bun.Glob(`src/**/*.ts`);

const entry = [
	...glob.scanSync({
		cwd: process.cwd(),
	}),
];

export default defineConfig({
	entry,
	outDir: 'dist',
	sourcemap: 'external',
	format: 'esm',
	target: 'bun',
	dts: false,
	define: {
		'Bun.env.NODE_ENV': JSON.stringify('production'),
	},
});
