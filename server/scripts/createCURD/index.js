/* eslint-disable @typescript-eslint/no-var-requires */
const nunjucks = require('nunjucks');
const createServer = require('./createServer');
const createCms = require('./createCms');

nunjucks.configure({ autoescape: true });

const [, , name, cname] = process.argv;
console.log('name, cname: ', name, cname);
// 例如 product_document  产品文档
if (!name) {
  console.log('缺少模块名称');
}
if (!cname) {
  console.log('缺少模块中文名称');
}

createServer(name, cname);
createCms(name, cname);
