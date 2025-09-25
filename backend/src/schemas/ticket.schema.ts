import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

export enum TicketType {
  VIP = 'VIP',
  STANDARD = 'Standard',
  STUDENT = 'Student',
  BUNDLE_OFFER = 'Bundle Offer',
  EARLY_BIRD = 'Early Bird',
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  referenceNumber: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true, enum: Object.values(TicketType) })
  ticketType: TicketType;

  @Prop({ required: true })
  qrCode: string;

  @Prop({ default: false })
  checkedIn: boolean;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop()
  checkedInAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);