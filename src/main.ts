import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './shared/logging.interceptor';

const DEFAULT_PORT = 8080;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());
    const port = process.env.port || DEFAULT_PORT;
    Logger.log(`Agile Tasks server started on port ${port}`, 'Bootstrap');
    await app.listen(port);
}
bootstrap();
