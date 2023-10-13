import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SystemDataSource } from './database/system.datasource';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ type: VersioningType.URI });
  await SystemDataSource.initialize()
    .then(() => {
      Logger.debug(`Database Successfully initialized`);
    })
    .catch((error) => {
      Logger.error(
        `Datasource spin up failed: ${error.message}`,
        error.trace,
        'Datasource initialization',
      );
      process.exit(1);
    });
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    Logger.debug(
      `Application started on port ${port}`,
      'Application Bootstrap',
    );
  });
}
bootstrap();
