const path = require('path');
const {
	FuseBox,
	CSSPlugin,
	SourceMapPlainJsPlugin,
	SassPlugin,
	EnvPlugin,
	QuantumPlugin,
	JSONPlugin,
} = require('fuse-box');

const isProduction = process.env.NODE_ENV === 'production';

const fuse = FuseBox.init({
	homeDir: '.',
	target: 'browser@es6',
	output: 'public/compiled/$name.js',
	sourceMaps: !isProduction,
	useTypescriptCompiler: true,
	plugins: [
		EnvPlugin({NODE_ENV: isProduction ? 'production' : 'development'}),
		[
			SassPlugin({
				header: `@import "web/media-queries";`,
				importer: true,
				macros: {
					$cssDir: path.resolve('public/css/'),
				},
				outputStyle: isProduction ? 'compressed' : 'nested',
			}),
			CSSPlugin(),
		],
		!isProduction && SourceMapPlainJsPlugin(),
		isProduction && QuantumPlugin(),
		JSONPlugin(),
	],
});
fuse.bundle('app') // name of the bundle, so name of the main file in public/root folder
	.splitConfig({browser: '/'}) // app.js has to know static url to resolve other split files
	.instructions(' > [web/index.tsx]'); // only application code

fuse.bundle('vendors') // bundle for dependencies only
	.splitConfig({browser: '/'}) // vendors.js has to know static url to resolve other split files
	.instructions(' ~ web/index.tsx'); // only external dependencies

fuse.run().then();
