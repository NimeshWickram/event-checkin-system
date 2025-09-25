import { TicketType } from '../schemas/ticket.schema';

export class TicketResponseDto {
  referenceNumber: string;
  customerName: string;
  ticketType: TicketType;
  checkedIn: boolean;
  quantity: number;
  price: number;
  totalRevenue: number;
  checkedInAt?: Date;
  createdAt: Date;
}

export class StatsResponseDto {
  totalTickets: number;
  totalCheckedIn: number;
  totalRevenue: number;
  checkedInRevenue: number;
  ticketTypeStats: TicketTypeStats[];
}

export class TicketTypeStats {
  ticketType: TicketType;
  total: number;
  checkedIn: number;
  percentage: number;
  totalRevenue: number;
  checkedInRevenue: number;
  averagePrice: number;
}

export class FinanceStatsResponseDto {
  totalRevenue: number;
  checkedInRevenue: number;
  pendingRevenue: number;
  averageTicketPrice: number;
  revenueByTicketType: RevenueByTicketType[];
  monthlyRevenue: MonthlyRevenue[];
}

export class RevenueByTicketType {
  ticketType: TicketType;
  totalRevenue: number;
  checkedInRevenue: number;
  ticketCount: number;
  averagePrice: number;
}

export class MonthlyRevenue {
  month: string;
  revenue: number;
  ticketsSold: number;
}