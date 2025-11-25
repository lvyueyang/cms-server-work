import * as chokidar from 'chokidar';
import * as fs from 'fs';
import { join } from 'path';

const compile = async (file_path: string, output: string) => {
  const LessPluginAutoPrefix = await import('less-plugin-autoprefix');
  const autoprefixPlugin = new LessPluginAutoPrefix({
    browsers: ['last 2 versions'],
  });
  const value = fs.readFileSync(file_path).toString();
  import('less').then((less) => {
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
  });
};

export function cssPretreatment(): void {
  chokidar.watch(join(process.cwd(), 'views/static/styles/**/*.less')).on('change', (value) => {
    try {
      compile(value, value.replace(/\.less/, '.css'));
    } catch (e) {
      console.error(e);
    }
  });
}
