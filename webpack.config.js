'use strict';
const path = require('path'),
	fs = require('fs'),
	SubresourceIntegrityPlugin = require('webpack-subresource-integrity').SubresourceIntegrityPlugin,
	PrintIntegrityPlugin = function () {
		this.apply = function (compiler) {
			compiler.hooks.done.tap('integrity', (stats) => {
				const assets = stats.toJson().assets;
				const integrity = assets[0].integrity;
				console.log('assets', assets);
				console.log('integrity', integrity);
				fs.writeFileSync(path.resolve(__dirname, 'dist', 'sri-integrity.txt'), integrity, 'utf8');
			});
		};
	};

module.exports = {
	mode: 'production',
	entry: './src/desole.js',
	output: {
		crossOriginLoading: 'anonymous',
		library: 'Desole',
		libraryTarget: 'window',
		filename: 'client-min-' + String(Date.now()) + '.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new SubresourceIntegrityPlugin({
			hashFuncNames: ['sha256', 'sha384'],
			enabled: true
		}),
		new PrintIntegrityPlugin()
	]
};
