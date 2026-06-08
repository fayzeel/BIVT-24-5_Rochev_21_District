import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const timestamp = new Date().toISOString();

    // Формируем строку лога
    const logMessage = `[${timestamp}] ${method} ${originalUrl} | IP: ${ip} | UA: ${userAgent}\n`;

    // Путь к файлу логов (в корне папки backend)
    const logFilePath = path.join(process.cwd(), 'requests.log');

    // Записываем в файл (асинхронно, чтобы не блокировать запрос)
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Ошибка записи в лог:', err);
      }
    });

    // Также выводим в консоль для наглядности
    console.log(logMessage.trim());

    next();
  }
}