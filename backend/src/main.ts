import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  }); // Enable CORS for frontend (supports Vercel and local)
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
