import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymobService } from '../payment/paymob.service';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionService, PaymobService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
