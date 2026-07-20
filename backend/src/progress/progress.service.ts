import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async markAsComplete(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { isCompleted: true },
      create: { userId, lessonId, isCompleted: true }
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    // 1. Get all lessons in the course
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });

    if (lessons.length === 0) return { percentage: 0, completedLessons: [] };

    const lessonIds = lessons.map(l => l.id);

    // 2. Get progress for these lessons
    const progress = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
        isCompleted: true
      }
    });

    const completedLessonIds = progress.map(p => p.lessonId);
    const percentage = Math.round((completedLessonIds.length / lessons.length) * 100);

    return {
      percentage,
      completedLessons: completedLessonIds
    };
  }
}
