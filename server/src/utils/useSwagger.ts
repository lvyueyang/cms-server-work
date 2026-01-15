import { exec } from 'node:child_process';
import * as path from 'node:path';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function runGapi() {
  const dir = path.join(process.cwd(), '../packages/api-interface');
  exec(`cd ${dir} && npm run gen`, (error, stdout) => {
    if (error) {
      console.error(`swagger 生成 TS 类型失败: ${error}`);
      return;
    } else {
      if (stdout.includes('typescript api file index.ts created in')) {
        console.log(`swagger 生成 TS 类型成功`);
      } else {
        console.error(`swagger 生成 TS 类型失败: ${stdout}`);
      }
    }
  });
}
export function useSwagger(app: NestExpressApplication) {
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境不生成 swagger 文档');
    return () => {};
  }
  const options = new DocumentBuilder().setTitle('管理后台').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, options, {
    // include: [
    //   UserAdminModule,
    //   AdminRoleModule,
    //   AuthModule,
    //   ProductModule,
    //   SolutionModule,
    //   NewsModule,
    //   SystemImageModule,
    //   SystemImageVersionModule,
    //   ValidateCodeModule,
    //   LoggerModule,
    //   ProductDocumentModule,
    // ],
  });
  SwaggerModule.setup('api/admin', app, document);
  return () => {
    runGapi();
  };
}
