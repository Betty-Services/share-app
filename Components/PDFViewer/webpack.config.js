const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	mode: 'production',
	entry: './src/index.js',
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
	output: {
		library: 'MaterialUI',
		libraryExport: 'default',
		libraryTarget: 'umd',
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{ from: 'node_modules/pdfjs-dist/cmaps/', to: 'cmaps/' }],
		}),
	],
};
