/* eslint-disable @typescript-eslint/no-var-requires */
const { upperFirst, camelCase } = require('lodash');
const nunjucks = require('nunjucks');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const loadTpl = (name) =>
  fs.readFileSync(path.join(__dirname, `./template/${name}.tpl`)).toString('utf-8');

const TPL = {
  controller: loadTpl('server/xx.controller'),
  service: loadTpl('server/xx.service'),
  dto: loadTpl('server/xx.dto'),
  entity: loadTpl('server/xx.entity'),
  module: loadTpl('server/xx.module'),
};

nunjucks.configure({ autoescape: true });

function createServerModule(name, cname) {
  const res = {
    entityName: upperFirst(camelCase(name)),
    name: name,
    cname: cname,
    permissionName: name.toLocaleUpperCase(),
  };
  const output = path.join(__dirname, '../../../server/src/modules', res.name);
  fse.ensureDirSync(output);

  if (fs.readdirSync(output).length) {
    console.error(`${res.name} 已存在`);
    return;
  }

  Object.entries(TPL).forEach(([key, tpl]) => {
    fs.writeFile(
      path.join(output, `${res.name}.${key}.ts`),
      nunjucks.renderString(tpl, res),
      (err) => {
        if (err) {
          return console.error(err);
        }
        console.log(`${key} success`);
      },
    );
  });
}

module.exports = createServerModule;
