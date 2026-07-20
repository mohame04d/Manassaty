import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { PaymobService } from '../payment/paymob.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService, private paymob: PaymobService) {}

  async getAllTeachers() {
    return this.prisma.teacherProfile.findMany({
      include: {
        user: true
      }
    });
  }

  async toggleSubscription(teacherProfileId: string, isActive: boolean) {
    const profile = await this.prisma.teacherProfile.findUnique({
      where: { id: teacherProfileId }
    });

    if (!profile) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prisma.teacherProfile.update({
      where: { id: teacherProfileId },
      data: {
        isActive,
        subscriptionEnds: isActive ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      }
    });
  }

  async createSubscriptionPayment(userId: string) {
    const profile = await this.prisma.teacherProfile.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!profile) throw new NotFoundException('Teacher profile not found');

    const amount = 500; // 500 EGP per month
    
    // Create pending invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        teacherProfileId: profile.id,
        amount,
        status: 'PENDING',
        billingPeriod: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    // Generate Paymob iframe URL
    const paymentUrl = await this.paymob.createPaymentSession(amount, invoice.id, {
      firstName: profile.user.name,
      lastName: 'Teacher',
      email: profile.user.email,
      phone: '+201000000000'
    });

    return { paymentUrl, invoiceId: invoice.id };
  }

  // Called after successful payment (webhook or simulated return)
  async verifySubscriptionPayment(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    // Update invoice to PAID
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    // Activate teacher profile
    await this.prisma.teacherProfile.update({
      where: { id: invoice.teacherProfileId },
      data: {
        isActive: true,
        subscriptionEnds: invoice.billingPeriod
      }
    });

    return { success: true, message: 'تم تفعيل الاشتراك بنجاح!' };
  }
}
