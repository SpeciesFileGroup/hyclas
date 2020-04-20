import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const config = {
	input: 'src/hyclas.js',
	output: [
		{
			file: pkg.module,
			format: 'esm',
			compact: true
		},
	],
	plugins: [babel()],
};

export default config;