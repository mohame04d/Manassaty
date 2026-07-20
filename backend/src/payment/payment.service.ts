import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async buyCourse(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (existingEnrollment) {
      throw new BadRequestException('You already own this course');
    }

    // SIMULATED PAYMENT: In a real scenario, we would create a pending CoursePurchase,
    // get a payment URL from Paymob, and wait for the webhook to create the Enrollment.
    
    // 1. Record the purchase
    await this.prisma.coursePurchase.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        status: 'COMPLETED'
      }
    });

    // 2. Create the enrollment
    await this.prisma.enrollment.create({
      data: {
        userId,
        courseId
      }
    });

    return { success: true, message: 'Payment simulated successfully. You are now enrolled!' };
  }

  async checkEnrollment(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });
    return { isEnrolled: !!enrollment };
  }
}
