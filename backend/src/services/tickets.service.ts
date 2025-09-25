import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketType } from '../schemas/ticket.schema';
import { CheckInDto } from '../dto/checkin.dto';
import { TicketResponseDto, StatsResponseDto, TicketTypeStats, FinanceStatsResponseDto, RevenueByTicketType } from '../dto/response.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async checkIn(checkInDto: CheckInDto): Promise<TicketResponseDto> {
    // Trim whitespace from reference number to handle input errors
    const cleanReferenceNumber = checkInDto.referenceNumber.trim();
    
    const ticket = await this.ticketModel.findOne({
      referenceNumber: cleanReferenceNumber,
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket not found with reference number: ${cleanReferenceNumber}`);
    }

    if (ticket.checkedIn) {
      throw new BadRequestException(`Ticket ${cleanReferenceNumber} is already checked in at ${ticket.checkedInAt}`);
    }

    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    await ticket.save();

    return this.mapToResponseDto(ticket);
  }

  async getAllTickets(): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketModel.find().sort({ createdAt: -1 });
    return tickets.map(ticket => this.mapToResponseDto(ticket));
  }

  async getStats(): Promise<StatsResponseDto> {
    const totalTickets = await this.ticketModel.countDocuments();
    const totalCheckedIn = await this.ticketModel.countDocuments({ checkedIn: true });

    // Calculate total revenue
    const allTickets = await this.ticketModel.find();
    const totalRevenue = allTickets.reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
    const checkedInRevenue = allTickets
      .filter(ticket => ticket.checkedIn)
      .reduce((sum, ticket) => sum + ticket.totalRevenue, 0);

    const ticketTypes = Object.values(TicketType);
    const ticketTypeStats: TicketTypeStats[] = [];

    for (const type of ticketTypes) {
      const typeTickets = await this.ticketModel.find({ ticketType: type });
      const total = typeTickets.length;
      const checkedIn = typeTickets.filter(ticket => ticket.checkedIn).length;
      const totalRevenue = typeTickets.reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
      const checkedInRevenue = typeTickets
        .filter(ticket => ticket.checkedIn)
        .reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
      const averagePrice = total > 0 ? totalRevenue / typeTickets.reduce((sum, ticket) => sum + ticket.quantity, 0) : 0;

      if (total > 0) {
        ticketTypeStats.push({
          ticketType: type,
          total,
          checkedIn,
          percentage: Math.round((checkedIn / total) * 100),
          totalRevenue,
          checkedInRevenue,
          averagePrice,
        });
      }
    }

    return {
      totalTickets,
      totalCheckedIn,
      totalRevenue,
      checkedInRevenue,
      ticketTypeStats,
    };
  }

  private mapToResponseDto(ticket: TicketDocument): TicketResponseDto {
    return {
      referenceNumber: ticket.referenceNumber,
      customerName: ticket.customerName,
      ticketType: ticket.ticketType,
      checkedIn: ticket.checkedIn,
      quantity: ticket.quantity,
      price: ticket.price,
      totalRevenue: ticket.totalRevenue,
      checkedInAt: ticket.checkedInAt,
      createdAt: (ticket as any).createdAt,
    };
  }

  async getFinanceStats(): Promise<FinanceStatsResponseDto> {
    const allTickets = await this.ticketModel.find();
    
    const totalRevenue = allTickets.reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
    const checkedInRevenue = allTickets
      .filter(ticket => ticket.checkedIn)
      .reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
    const pendingRevenue = totalRevenue - checkedInRevenue;
    
    const totalQuantity = allTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const averageTicketPrice = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

    // Revenue by ticket type
    const ticketTypes = Object.values(TicketType);
    const revenueByTicketType: RevenueByTicketType[] = [];

    for (const type of ticketTypes) {
      const typeTickets = allTickets.filter(ticket => ticket.ticketType === type);
      if (typeTickets.length > 0) {
        const totalRevenue = typeTickets.reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
        const checkedInRevenue = typeTickets
          .filter(ticket => ticket.checkedIn)
          .reduce((sum, ticket) => sum + ticket.totalRevenue, 0);
        const ticketCount = typeTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
        const averagePrice = ticketCount > 0 ? totalRevenue / ticketCount : 0;

        revenueByTicketType.push({
          ticketType: type,
          totalRevenue,
          checkedInRevenue,
          ticketCount,
          averagePrice,
        });
      }
    }

    return {
      totalRevenue,
      checkedInRevenue,
      pendingRevenue,
      averageTicketPrice,
      revenueByTicketType,
      monthlyRevenue: [{ month: 'Current', revenue: totalRevenue, ticketsSold: totalQuantity }],
    };
  }
}