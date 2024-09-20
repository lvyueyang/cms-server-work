/* eslint-disable @typescript-eslint/no-var-requires */
const { upperFirst, camelCase, kebabCase } = require('lodash');
const nunjucks = require('nunjucks');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const loadTpl = (name) =>
  fs
    .readFileSync(path.join(__dirname, `./template/cms/${name}`))
    .toString('utf-8');

nunjucks.configure({ autoescape: true });

const cbFn = (err) => {
  if (err) {
    return console.error(err);
  }
};

function createCms(name, cname) {
  const res = {
    entityName: upperFirst(camelCase(name)),
    pathName: kebabCase(name),
    name: name,
    cname: cname,
  };
  const output = path.join(
    __dirname,
    '../../../client-cms/src/pages',
    res.pathName,
  );
  console.log('output: ', output);

  fse.ensureDirSync(output);
  fse.ensureDirSync(path.join(output, 'module'));

  // if (fs.readdirSync(output).length) {
  //   console.error(`${res.name} 已存在`);
  //   return;
  // }

  [
    // 列表
    ['index', 'tsx'],
    // 详情
    ['form', 'tsx'],
    // 模块
    ['module/index'],
    // 接口
    ['module/services'],
  ].forEach(([key, ext = 'ts']) => {
    const content = nunjucks.renderString(loadTpl(`${key}.tpl`), res);
    fs.writeFile(path.join(output, `${key}.${ext}`), content, cbFn);
  });
}

module.exports = createCms;
