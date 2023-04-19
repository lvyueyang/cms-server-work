/**
 * 使用 Swagger
 */
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exec } from 'child_process';
import * as path from 'path';

function runGapi() {
  const dir = path.join(process.cwd(), '../client-cms');
  exec(`cd ${dir} && npm run gapi`, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
}
export function useSwagger(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('管理后台')
    .setVersion('1.0')
    .build();
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
  if (process.env.NODE_ENV === 'development') {
    runGapi();
  }
}
