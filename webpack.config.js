// webpack v4
var webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
	entry: {
		main: './src/index.js',
		syntax: './src/syntax/syntax.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[chunkhash].js'
	},
	devServer: {
		contentBase: './dist'
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
								return [require('precss'), require('autoprefixer')];
							}
						}
					},
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development'
						}
					},
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: './images/[hash].[ext]'
						}
					}
				]
			},
			{
				test: /bootstrap\/dist\/js\/umd\//,
				use: 'imports-loader?jQuery=jquery'
			},
			{
				test: /font-awesome\.config\.js/,
				use: [{ loader: 'style-loader' }, { loader: 'font-awesome-loader' }]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.[contenthash].css'
		}),
		new HtmlWebpackPlugin({
			inject: false,
			hash: true,
			template: './src/index.html',
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			inject: false,
			hash: true,
			template: './src/syntax/index.html',
			filename: 'syntax/index.html'
		}),
		// new TransferWebpackPlugin([{ from: 'client' }]),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		})
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				test: /\.js(\?.*)?$/i
			})
		]
	}
};
