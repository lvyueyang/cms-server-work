const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const less = require('less');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const chokidar = require('chokidar');

const outputDir = path.join(__dirname, '/dist');
console.log('outputDir: ', outputDir);

const isProd = false;

function buildJs(module) {
  let mode = 'development';
  let devtool;
  let optimization;
  if (isProd) {
    mode = 'production';
    devtool = 'inline-source-map';
    optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ie8: false,
            safari10: false,
          },
        }),
      ],
    };
  }
  webpack(
    {
      context: path.resolve(__dirname, './'),
      mode,
      devtool,
      resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
      },
      entry: `./src/pages/${module}/main.ts`,
      output: {
        filename: '[name].js',
        path: path.join(__dirname + '/dist/pages/' + module),
      },
      module: {
        rules: [
          // {
          //   test: /\.css$/,
          //   use: ['css-loader'],
          // },
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
          },
          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          {
            test: /\.js$/,
            loader: 'source-map-loader',
          },
        ],
      },
      optimization,
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error('build error');
        if (err) {
          console.log('ERR ', err);
        }
        if (stats.hasErrors()) {
          console.log(stats.compilation.errors);
        }
      } else {
        console.log('build success');
      }
    },
  );
}

const autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: ['last 2 versions'],
});
const compileLess = (file_path, output) => {
  const value = fs.readFileSync(file_path).toString();
  less
    .render(value, {
      compress: true,
      plugins: [autoprefixPlugin],
    })
    .then((res) => {
      fse.ensureFileSync(output);
      fs.writeFile(output, res.css, (err) => {
        if (err) {
          console.log('Less 编译失败: ', file_path, err);
        }
      });
    });
};

function buildStyle(module) {
  compileLess(
    path.join(__dirname, '/src/pages/' + module + '/style.less'),
    path.join(outputDir, '/pages/' + module + '/style.css'),
  );
}

function build(module) {
  buildJs(module);
  buildStyle(module);
}

// build('home');
chokidar.watch(path.join(__dirname, '/src/**/*')).on('change', (value) => {
  try {
    const key = path.join(__dirname, '/src/pages/');
    // 页面模块的特殊处理
    if (value.startsWith(key)) {
      const module = value.split(key)[1].split(path.join('/'))[0];
      build(module);
    } else {
      if (path.parse(value).ext === '.less') {
        const s = path.join(__dirname, '/src');
        const o = value.split(s)[1].replace(/\.less/, '.css');
        const t = path.join(outputDir, o);
        console.log('t: ', t);
        compileLess(value, t);
      }
    }
    // compile(value, value.replace(/\.less/, '.css'));
  } catch (e) {
    console.error(e);
  }
});
