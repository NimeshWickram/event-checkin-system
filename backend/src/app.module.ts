import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';
import { SeedService } from './services/seed.service';
import { Ticket, TicketSchema } from './schemas/ticket.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/event-checkin'),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
  controllers: [AppController, TicketsController],
  providers: [AppService, TicketsService, SeedService],
})
export class AppModule {}
