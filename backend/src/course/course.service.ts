import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(userId: string, data: any) {
    const teacherProfile = await this.prisma.teacherProfile.findUnique({
      where: { userId }
    });

    if (!teacherProfile) {
      throw new BadRequestException('Teacher profile not found');
    }

    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        teacherProfileId: teacherProfile.id
      }
    });
  }

  async getTeacherCourses(userId: string) {
    const teacherProfile = await this.prisma.teacherProfile.findUnique({
      where: { userId }
    });

    if (!teacherProfile) return [];

    return this.prisma.course.findMany({
      where: { teacherProfileId: teacherProfile.id },
      include: { lessons: true }
    });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        teacherProfile: {
          include: { user: true } // Include teacher name
        }
      }
    });
  }

  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
}
