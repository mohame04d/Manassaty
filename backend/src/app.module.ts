import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TenantModule } from './tenant/tenant.module';
import { LessonModule } from './lesson/lesson.module';
import { PaymentModule } from './payment/payment.module';
import { ProgressModule } from './progress/progress.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StudentModule } from './student/student.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [PrismaModule, AuthModule, CourseModule, SubscriptionModule, TenantModule, LessonModule, PaymentModule, ProgressModule, AnalyticsModule, StudentModule, QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
