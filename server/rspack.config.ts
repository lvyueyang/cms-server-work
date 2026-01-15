import path from 'path';
import fs from 'fs';
import { Configuration, CssExtractRspackPlugin } from '@rspack/core';

const modulesDir = path.resolve(__dirname, './views/modules');
const outputDir = path.resolve(__dirname, './public/_fe_');

const entries: Record<string, string[]> = {};

if (fs.existsSync(modulesDir)) {
  const modules = fs.readdirSync(modulesDir);
  modules.forEach((moduleName) => {
    const modulePath = path.join(modulesDir, moduleName);
    // Check if it is a directory
    if (fs.statSync(modulePath).isDirectory()) {
      const tsEntry = path.join(modulePath, 'main.ts');
      const scssEntry = path.join(modulePath, 'style.scss');

      const entryPoints: string[] = [];
      if (fs.existsSync(tsEntry)) {
        entryPoints.push(tsEntry);
      }
      if (fs.existsSync(scssEntry)) {
        entryPoints.push(scssEntry);
      }

      // Only add entry if at least one file exists
      if (entryPoints.length > 0) {
        entries[moduleName] = entryPoints;
      }
    }
  });
}

const config: Configuration = {
  entry: entries,
  output: {
    path: outputDir,
    filename: '[name].js',
    clean: true,
    publicPath: '/_fe_/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'sass-loader',
        ],
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    new CssExtractRspackPlugin({
      filename: '[name].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
};

export default config;
