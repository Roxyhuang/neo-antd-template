import config from 'config';
import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SaveAssetsJson from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import JavaScriptObfuscator from 'webpack-obfuscator';
// import ZipPlugin from 'zip-webpack-plugin';

import webpackConfig from './webpack.base.conf';

const PUBLIC_PATH = config.get('publicPath');
const APP_ENTRY_POINT = config.get('appEntry');
const IS_DEBUG = config.get('debug') || false;
const BUNDLE_LIST = config.get('bundleConfig') || [];
const IS_UGLIFYJS = config.get('env') !== 'release';

console.log(IS_UGLIFYJS);

let webpackProdOutput;

let vendorList = config.get('vendorList') || [];

if (IS_DEBUG) {
  vendorList.unshift('eruda');
}

let entryConfig = {
  vendors: vendorList
};

entryConfig = Object.assign(entryConfig,BUNDLE_LIST);

// Config for Javascript file

if (Object.entries(APP_ENTRY_POINT).length > 1) {

  Object.entries(APP_ENTRY_POINT).forEach(item => {
    Object.assign(entryConfig, {[`${item[0]}/assets/js/${item[0]}`]: [item[1]]});
  });

} else if(Object.entries(APP_ENTRY_POINT).length === 1){
  Object.entries(APP_ENTRY_POINT).forEach(item => {
    Object.assign(entryConfig, {[`assets/js/${item[0]}`]: [item[1]]});
  });
} else {
  console.log(chalk.red('You must define a entry'));
}
//Config for output

if (Object.entries(APP_ENTRY_POINT).length > 1) {
  webpackProdOutput = {
    publicPath: `${PUBLIC_PATH}/`,
    filename: '[name].[chunkhash].js',
    chunkFilename: `${Object.entries(APP_ENTRY_POINT)[0][0]}/assets/js/[id].[chunkhash].js`,
  };

} else  if (Object.entries(APP_ENTRY_POINT).length === 1){
  webpackProdOutput = {
    publicPath: `${PUBLIC_PATH}/`,
    filename: '[name].[chunkhash].js',
    chunkFilename: "assets/js/[id].[chunkhash].js",
  };
} else {
  console.log(chalk.red('You must define a entry'));
}

webpackConfig.output = Object.assign(webpackConfig.output, webpackProdOutput);

webpackConfig.devtool = 'source-map';

webpackConfig.entry = entryConfig;

webpackConfig.module.rules = webpackConfig.module.rules.concat({});

webpackConfig.plugins.push(
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.IgnorePlugin(/un~$/),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false,
      drop_console: config.get('env') === 'production',
      sequences: true,
      properties: true,
      dead_code: true,
      drop_debugger: true,
      conditionals: true,
      unused: true,
      booleans: true,
      if_return: true,
      join_vars: true,
      loops: true,
      hoist_funs: true,
      cascade: true
    },
    mangle: { eval: true, toplevel: true, properties: true, },
    properties: {
      output: {
        ascii_only:true,
        code: true  // optional - faster if false
      }
    }

  }),
  new StyleLintPlugin({
    context: "src",
    configFile: '.stylelintrc.js',
    files: '**/*.less',
    failOnError: false,
    quiet: false,
    syntax: 'less'
  }),
);

webpackConfig.module.rules = webpackConfig.module.rules.concat(
  {
    test: /\.css|less$/,
    exclude: [path.resolve('node_modules'), path.resolve('src/assets/css/mod_css')],
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
      use: [
        'css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
        {
          loader: 'postcss-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
          options: {
            sourceMap: true,
            config: {
              path: 'build/config/postcss.config.js'
            }
          }
        },
        'less-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
      ]
    })
  },
  {
    test: /\.css|less$/,
    include: [path.resolve('node_modules'), path.resolve('src/assets/css/mod_css')],
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader?sourceMap=true',
        {
          loader: 'postcss-loader?sourceMap=true',
          options: {
            sourceMap: true,
            config: {
              path: 'build/config/postcss.config.js'
            }
          }
        },
        'less-loader?sourceMap=true',
      ]
    })
  },
);

// Config for Html file and other plugins
if (Object.entries(APP_ENTRY_POINT).length > 1) {
  Object.keys(APP_ENTRY_POINT).forEach((name, index) => {
    let chunks = [];
    Object.keys(BUNDLE_LIST).forEach((chunk)=> {
      chunks.push(chunk);
    });
    if(index === 0) {
      webpackConfig.plugins.push(
        new ExtractTextPlugin({

          filename: `${name}/assets/css/global.[chunkhash].css`,
          disable: false,
          allChunks: true,
        }),
      )
    }
    new JavaScriptObfuscator ({
      rotateUnicodeArray: true
    }, [`${name}/assets/js/${name}.js`]),
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: `${name}/${name}.html`,
        template: 'public/index.html',
        inject:'true',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunks: [`${name}/assets/js/${name}`, 'vendors', ...chunks],
      }),
      new SaveAssetsJson({
        // path: path.join(__dirname, 'dist'),
        filename: `dist/${name}/assets/assets.json`,
        prettyPrint: true,
        metadata: {
          version: process.env.PACKAGE_VERSION,
        },
      }),
      new CopyWebpackPlugin([{
        from: 'public/assets/',
        to: `${name}/assets/`
      }]),
    );
  });
} else  if(Object.entries(APP_ENTRY_POINT).length === 1){
  let chunks = [];
  Object.keys(BUNDLE_LIST).forEach((chunk)=> {
    chunks.push(chunk);
  });
  Object.keys(APP_ENTRY_POINT).forEach(name => {
    webpackConfig.plugins.push(
      new JavaScriptObfuscator ({
        rotateUnicodeArray: true
      }, [`${name}.js`]),
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: 'public/index.html',
        inject:'true',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunks: [`assets/js/${name}`, 'vendors' , ...chunks],
      }),
      new ExtractTextPlugin({
        filename: 'assets/css/global.[chunkhash].css',
        disable: false,
        allChunks: true,
      }),
      new SaveAssetsJson({
        // path: path.join(__dirname, 'dist'),
        filename: 'dist/assets/assets.json',
        prettyPrint: true,
        metadata: {
          version: process.env.PACKAGE_VERSION,
        },
      }),
      new CopyWebpackPlugin([{
        from: 'public/assets/',
        to: 'assets/'
      }]),
    );
  });
} else {
  console.log(chalk.red('You must define a entry'));
}

// if (config.get('env') === 'production') {
//   webpackConfig.plugins.push(
//     new ZipPlugin({
//       filename: `${config.get('zipConfig').dirName}` || 'dist',
//     })
//   )
// }

export default webpackConfig;

