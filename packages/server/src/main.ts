import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { PaginationParseIntPipe } from './common/pipes/parse-int.pipe';
import { LoggerService } from './modules/logger/logger.service';
import { getLocalIPv4Address, getUploadFileDirPath } from './utils';
import { cssPretreatment } from './utils/cssPretreatment';
import { useSwagger } from './utils/useSwagger';

async function bootstrap() {
  const PORT = process.env.PORT;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LoggerService));
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
  app.useGlobalPipes(new PaginationParseIntPipe());
  app.useGlobalPipes(new ValidationPipe());

  const uploadFileDir = getUploadFileDirPath();
  // app.useStaticAssets(join(process.cwd(), 'public'));
  app.useStaticAssets(join(process.cwd(), 'views/static'), {
    prefix: '/_fe/static',
  });
  app.useStaticAssets(uploadFileDir, {
    prefix: '/uploadfile',
  });

  // app.use(csurf());

  /** Swagger */
  if (process.env.NODE_ENV === 'development') {
    useSwagger(app);
  }

  await app.listen(PORT);

  cssPretreatment();

  // 打印地址
  const ipv4 = getLocalIPv4Address();
  console.log('\n');
  console.log(`http://127.0.0.1:${PORT}/`);
  if (ipv4) {
    console.log(`http://${ipv4}:${PORT}/`);
  }
}
bootstrap();
