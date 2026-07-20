import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createCourse(@Request() req: any, @Body() body: any) {
    // Only teachers can create courses
    if (req.user.role !== 'TEACHER') {
      throw new Error('Only teachers can create courses');
    }
    return this.courseService.createCourse(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  getTeacherCourses(@Request() req: any) {
    return this.courseService.getTeacherCourses(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }
}
