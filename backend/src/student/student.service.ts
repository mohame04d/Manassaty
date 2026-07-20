import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string, subdomain: string) {
    // Find the teacher by subdomain
    const teacherProfile = await this.prisma.teacherProfile.findUnique({
      where: { subdomain },
      include: { user: true }
    });

    if (!teacherProfile) {
      throw new NotFoundException('Teacher platform not found');
    }

    // Find all courses for this teacher
    const allCourses = await this.prisma.course.findMany({
      where: { teacherProfileId: teacherProfile.id },
      include: {
        lessons: true
      }
    });

    // Find all purchases by this student
    const purchases = await this.prisma.coursePurchase.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { courseId: true }
    });
    const purchasedCourseIds = purchases.map(p => p.courseId);

    // Find all progress by this student
    const progress = await this.prisma.lessonProgress.findMany({
      where: { userId, isCompleted: true }
    });
    const completedLessonIds = progress.map(p => p.lessonId);
    
    const totalCompletedLessons = completedLessonIds.length;
    let totalPurchasedCourses = 0;

    const myCourses: any[] = [];
    const availableCourses: any[] = [];

    // Categorize courses
    allCourses.forEach(course => {
      const isPurchased = purchasedCourseIds.includes(course.id);
      
      const coursePayload: any = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
      };

      if (isPurchased) {
        totalPurchasedCourses++;
        const totalLessons = course.lessons.length;
        const completedInCourse = course.lessons.filter(l => completedLessonIds.includes(l.id)).length;
        const percentage = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;
        
        coursePayload.progressPercentage = percentage;
        coursePayload.totalLessons = totalLessons;
        coursePayload.completedLessons = completedInCourse;
        myCourses.push(coursePayload);
      } else {
        availableCourses.push(coursePayload);
      }
    });

    return {
      teacherName: teacherProfile.user.name,
      stats: {
        totalPurchasedCourses,
        totalCompletedLessons,
        points: totalCompletedLessons * 10, // 10 points per lesson
      },
      myCourses,
      availableCourses
    };
  }
}
