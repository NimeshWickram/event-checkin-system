import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketType } from '../schemas/ticket.schema';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async seedTickets(): Promise<void> {
    const existingTickets = await this.ticketModel.countDocuments();
    if (existingTickets > 0) {
      console.log('Tickets already exist. Skipping seeding.');
      return;
    }

    console.log('No tickets found. Seeding database with sample data...');

    const sampleTickets = [
      { customerName: 'John Doe', ticketType: TicketType.VIP, quantity: 1, price: 150 },
      { customerName: 'Jane Smith', ticketType: TicketType.STANDARD, quantity: 2, price: 75 },
      { customerName: 'Mike Johnson', ticketType: TicketType.STUDENT, quantity: 1, price: 25 },
      { customerName: 'Sarah Wilson', ticketType: TicketType.EARLY_BIRD, quantity: 1, price: 60 },
      { customerName: 'David Brown', ticketType: TicketType.BUNDLE_OFFER, quantity: 4, price: 50 },
      { customerName: 'Emily Davis', ticketType: TicketType.VIP, quantity: 1, price: 150 },
      { customerName: 'Chris Anderson', ticketType: TicketType.STANDARD, quantity: 1, price: 75 },
      { customerName: 'Lisa Martinez', ticketType: TicketType.STUDENT, quantity: 1, price: 25 },
      { customerName: 'Robert Taylor', ticketType: TicketType.EARLY_BIRD, quantity: 2, price: 60 },
      { customerName: 'Amanda Clark', ticketType: TicketType.STANDARD, quantity: 1, price: 75 },
      { customerName: 'Kevin Lee', ticketType: TicketType.BUNDLE_OFFER, quantity: 3, price: 50 },
      { customerName: 'Nicole White', ticketType: TicketType.VIP, quantity: 1, price: 150 },
      { customerName: 'Jason Garcia', ticketType: TicketType.STUDENT, quantity: 1, price: 25 },
      { customerName: 'Rachel Thompson', ticketType: TicketType.STANDARD, quantity: 2, price: 75 },
      { customerName: 'Mark Rodriguez', ticketType: TicketType.EARLY_BIRD, quantity: 1, price: 60 },
    ];

    for (const ticketData of sampleTickets) {
      const referenceNumber = uuidv4();
      const qrCode = await QRCode.toDataURL(referenceNumber);
      const totalRevenue = ticketData.price * ticketData.quantity;

      const ticket = new this.ticketModel({
        referenceNumber,
        customerName: ticketData.customerName,
        ticketType: ticketData.ticketType,
        qrCode,
        quantity: ticketData.quantity,
        price: ticketData.price,
        totalRevenue,
        checkedIn: false,
      });

      await ticket.save();
    }

    console.log('Sample tickets seeded successfully');
  }
}