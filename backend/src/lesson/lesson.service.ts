import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async addLesson(userId: string, courseId: string, data: any) {
    // Check if the user owns the course
    const teacherProfile = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (!teacherProfile) throw new ForbiddenException('Not a teacher');

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.teacherProfileId !== teacherProfile.id) {
      throw new ForbiddenException('You do not own this course');
    }

    return this.prisma.lesson.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        content: data.content,
        courseId: courseId,
        order: data.order || 0
      }
    });
  }

  async getCourseLessons(userId: string, courseId: string) {
    // Allow if teacher owns course, OR student is enrolled
    let isAuthorized = false;

    // Check teacher
    const teacherProfile = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (teacherProfile) {
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });
      if (course && course.teacherProfileId === teacherProfile.id) isAuthorized = true;
    }

    // Check student enrollment
    if (!isAuthorized) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId }
        }
      });
      if (enrollment) isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new ForbiddenException('You must purchase this course to view its lessons');
    }

    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });
  }

  async deleteLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { course: true } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const teacherProfile = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (!teacherProfile || lesson.course.teacherProfileId !== teacherProfile.id) {
      throw new ForbiddenException('You do not own this lesson');
    }

    return this.prisma.lesson.delete({ where: { id: lessonId } });
  }
}
