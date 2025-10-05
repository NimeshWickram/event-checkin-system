import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './services/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with more flexible configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  // Seed data after app starts
  const seedService = app.get(SeedService);
  await seedService.seedTickets();
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();