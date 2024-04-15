const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
  name: 'index.ts',
  output: path.join(__dirname, './'),
  url: 'http://127.0.0.1:7100/api/admin-json',
  generateClient: false,
}).catch((e) => console.error(e));
