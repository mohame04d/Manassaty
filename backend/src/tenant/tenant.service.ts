import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async updateSubdomain(userId: string, subdomain: string) {
    // Trim spaces, convert to lowercase, and replace internal spaces with dashes
    const cleanSubdomain = subdomain.trim().toLowerCase().replace(/\s+/g, '-');

    // Validate format (alphanumeric and dashes only)
    if (!/^[a-z0-9-]+$/.test(cleanSubdomain)) {
      throw new BadRequestException('الرابط يجب أن يحتوي على حروف إنجليزية وأرقام وعلامة الناقص فقط، بدون مسافات.');
    }

    const existing = await this.prisma.teacherProfile.findUnique({
      where: { subdomain: cleanSubdomain }
    });

    if (existing && existing.userId !== userId) {
      throw new BadRequestException('هذا الرابط مستخدم بالفعل من قبل مدرس آخر، يرجى اختيار رابط مختلف.');
    }

    return this.prisma.teacherProfile.upsert({
      where: { userId },
      update: { subdomain: cleanSubdomain },
      create: { userId, subdomain: cleanSubdomain, isActive: false }
    });
  }

  async getTenantBySubdomain(subdomain: string) {
    const tenant = await this.prisma.teacherProfile.findUnique({
      where: { subdomain },
      include: {
        user: true,
        courses: {
          include: { lessons: true }
        }
      }
    });

    if (!tenant) {
      throw new NotFoundException('المنصة غير موجودة');
    }

    if (!tenant.isActive) {
      throw new BadRequestException('هذه المنصة مغلقة حالياً لانتهاء الاشتراك. يرجى مراجعة المدرس.');
    }

    return tenant;
  }

  async getActiveTeachers() {
    return this.prisma.teacherProfile.findMany({
      where: { isActive: true },
      include: { user: true }
    });
  }

  async updateProfile(userId: string, data: { bio?: string, profileImage?: string, experienceYears?: number, subject?: string }) {
    return this.prisma.teacherProfile.update({
      where: { userId },
      data
    });
  }
}
