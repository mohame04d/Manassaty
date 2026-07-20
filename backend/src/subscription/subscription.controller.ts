import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('teachers')
  getAllTeachers(@Request() req: any) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Only SuperAdmin can view all teachers');
    }
    return this.subscriptionService.getAllTeachers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('toggle/:id')
  toggleSubscription(@Request() req: any, @Param('id') id: string, @Body() body: { isActive: boolean }) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Only SuperAdmin can manage subscriptions');
    }
    return this.subscriptionService.toggleSubscription(id, body.isActive);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  createSubscriptionPayment(@Request() req: any) {
    if (req.user.role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can subscribe to the platform');
    }
    return this.subscriptionService.createSubscriptionPayment(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verifySubscriptionPayment(@Request() req: any, @Body() body: { invoiceId: string }) {
    if (req.user.role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can verify their subscriptions');
    }
    return this.subscriptionService.verifySubscriptionPayment(body.invoiceId);
  }
}
