const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
  name: 'serverApi.ts',
  output: path.resolve(process.cwd(), '@/interface'),
  url: 'http://127.0.0.1:7000/api/admin-json',
  generateClient: false,
}).catch((e) => console.error(e));
