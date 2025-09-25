import { Controller, Post, Get, Body, ValidationPipe } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { CheckInDto } from '../dto/checkin.dto';
import { TicketResponseDto, StatsResponseDto, FinanceStatsResponseDto } from '../dto/response.dto';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('checkin')
  async checkIn(@Body(ValidationPipe) checkInDto: CheckInDto): Promise<TicketResponseDto> {
    return this.ticketsService.checkIn(checkInDto);
  }

  @Get()
  async getAllTickets(): Promise<TicketResponseDto[]> {
    return this.ticketsService.getAllTickets();
  }

  @Get('stats')
  async getStats(): Promise<StatsResponseDto> {
    return this.ticketsService.getStats();
  }

  @Get('finance')
  async getFinanceStats(): Promise<FinanceStatsResponseDto> {
    return this.ticketsService.getFinanceStats();
  }
}