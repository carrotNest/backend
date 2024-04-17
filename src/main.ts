import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger';
import { LoggingInterceptor } from './interceptors/logging-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000', 
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
      credentials: true, 
    },
  });
  
  app.useGlobalPipes(new ValidationPipe({transform: true,whitelist: true, }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  setupSwagger(app);
  await app.listen(8080);
}
bootstrap();
