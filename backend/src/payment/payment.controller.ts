import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('buy/:courseId')
  buyCourse(@Request() req: any, @Param('courseId') courseId: string) {
    return this.paymentService.buyCourse(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:courseId')
  checkEnrollment(@Request() req: any, @Param('courseId') courseId: string) {
    return this.paymentService.checkEnrollment(req.user.id, courseId);
  }
}
