const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        main: "./src"
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].[chunkhash].chunk.js",
        chunkFilename: "[chunkhash].[id].js"
    },
    externals: {
        angular: 'angular',
        ngSanitize: 'angular-sanitize',
        ngLocale: 'angular-locale_fr-fr',
        'ods-widgets': 'ods-widgets'
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: process.env.NODE_ENV === 'development',
                    },
                },
                'css-loader',
                'sass-loader',
            ],
        },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: false,
        port: process.env.PORT || 9000,
        before: function (app, server, compiler) {
            app.get("/templates/list-gen", function (request, response) {
                response.sendFile(__dirname + '/src/list-gen.html');
            });
        }
    }
}