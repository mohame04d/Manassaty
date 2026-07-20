import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard/:subdomain')
  getStudentDashboard(@Request() req: any, @Param('subdomain') subdomain: string) {
    return this.studentService.getDashboardData(req.user.id, subdomain);
  }
}
