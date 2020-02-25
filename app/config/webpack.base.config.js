const path = require('path');
const webpack = require('webpack');
const configurator = require('webpack-config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = new configurator.default().merge({
    entry: './src/entry.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/'
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.ProgressPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
        }),
        new HtmlWebpackPlugin({
            getData: () => {
                try {
                    return JSON.parse(`./src/pages/index/index.json`, 'utf8');
                } catch (e) {
                    console.warn(`data.json was not provided for page index`);
                    return {};
                }
            },
            filename: 'index.html',
            template: './src/pages/index/index.pug',
            alwaysWriteToDisk: true,
            inject: 'body',
            hash: true,
        })
    ].concat(),
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: ["pug-loader"]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /[\/]jquery\.js$/,
                use: 'expose-loader?$!expose?jQuery'
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ]
    },
    devServer: {
        watchContentBase: true,
        hot: true
    }
});