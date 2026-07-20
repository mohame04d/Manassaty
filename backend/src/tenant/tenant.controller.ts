import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subdomain')
  updateSubdomain(@Request() req: any, @Body() body: { subdomain: string }) {
    if (req.user.role !== 'TEACHER') {
      throw new Error('فقط المدرس يمكنه تخصيص رابط المنصة');
    }
    return this.tenantService.updateSubdomain(req.user.id, body.subdomain);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  updateProfile(@Request() req: any, @Body() body: { bio?: string, profileImage?: string, experienceYears?: number, subject?: string }) {
    if (req.user.role !== 'TEACHER') {
      throw new Error('فقط المدرس يمكنه تعديل الملف الشخصي');
    }
    return this.tenantService.updateProfile(req.user.id, body);
  }

  @Get('active-teachers')
  getActiveTeachers() {
    return this.tenantService.getActiveTeachers();
  }

  @Get(':subdomain')
  getTenantStorefront(@Param('subdomain') subdomain: string) {
    return this.tenantService.getTenantBySubdomain(subdomain);
  }
}
