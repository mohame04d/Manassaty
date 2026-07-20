import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getTeacherDashboardStats(@Request() req: any) {
    if (req.user.role !== 'TEACHER') {
      throw new Error('Unauthorized');
    }
    return this.analyticsService.getTeacherStats(req.user.id);
  }
}
