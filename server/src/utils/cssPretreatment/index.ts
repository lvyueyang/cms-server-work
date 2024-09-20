import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as less from 'less';
import * as LessPluginAutoPrefix from 'less-plugin-autoprefix';
import { join } from 'path';

const autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: ['last 2 versions'],
});

const compile = (file_path: string, output: string) => {
  const value = fs.readFileSync(file_path).toString();
  less
    .render(value, {
      compress: true,
      plugins: [autoprefixPlugin],
    })
    .then((res) => {
      fs.writeFile(output, res.css, (err) => {
        if (err) {
          console.log('Less 编译失败: ', file_path, err);
        }
      });
    });
};

export function cssPretreatment(): void {
  chokidar
    .watch(join(process.cwd(), 'views/static/styles/**/*.less'))
    .on('change', (value) => {
      try {
        compile(value, value.replace(/\.less/, '.css'));
      } catch (e) {
        console.error(e);
      }
    });
}
