import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './services/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
  
  // Seed data after app starts
  const seedService = app.get(SeedService);
  await seedService.seedTickets();
  
  console.log('Application is running on: http://localhost:3001');
}
bootstrap();
