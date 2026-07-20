import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getTeacherStats(userId: string) {
    const profile = await this.prisma.teacherProfile.findUnique({
      where: { userId },
      include: {
        courses: {
          include: {
            purchases: {
              where: { status: 'COMPLETED' }
            },
            enrollments: true
          }
        }
      }
    });

    if (!profile) throw new NotFoundException('Teacher profile not found');

    let totalRevenue = 0;
    let totalStudents = 0;
    const totalCourses = profile.courses.length;

    // Calculate totals
    profile.courses.forEach(course => {
      // Sum revenue from completed purchases
      course.purchases.forEach(purchase => {
        totalRevenue += purchase.amount;
      });
      // Count unique students per course (or total enrollments)
      totalStudents += course.enrollments.length;
    });

    return {
      totalRevenue,
      totalStudents,
      totalCourses,
      isActive: profile.isActive,
      subscriptionEnds: profile.subscriptionEnds,
      subdomain: profile.subdomain,
      bio: profile.bio,
      profileImage: profile.profileImage,
      experienceYears: profile.experienceYears,
      subject: profile.subject
    };
  }
}
