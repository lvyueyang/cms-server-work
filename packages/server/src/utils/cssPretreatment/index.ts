import * as chokidar from 'chokidar';
import * as fs from 'fs';
import { join } from 'path';
import * as sass from 'sass';

const compileSass = (input: string, output: string) => {
  sass.compileAsync(input, { style: 'compressed' }).then((res) => {
    fs.writeFile(output, res.css, (err) => {
      if (err) {
        console.log('err: ', err);
      } else {
        console.log('编译成功', output);
      }
    });
  });
};

export function cssPretreatment(): void {
  chokidar
    .watch(join(process.cwd(), 'views/static/styles/**/*.scss'))
    .on('change', (e) => {
      try {
        compileSass(e, e.replace(/\.scss/, '.css'));
      } catch (e) {
        console.error(e);
      }
    });
}
