import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware'; // <-- Добавили

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');

  // Подключаем логирование всех запросов
  app.use(new LoggingMiddleware().use); // <-- Добавили

  await app.listen(3000);
}
bootstrap();