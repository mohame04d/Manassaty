import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':courseId')
  addLesson(@Request() req: any, @Param('courseId') courseId: string, @Body() body: any) {
    return this.lessonService.addLesson(req.user.id, courseId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('course/:courseId')
  getCourseLessons(@Request() req: any, @Param('courseId') courseId: string) {
    return this.lessonService.getCourseLessons(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':lessonId')
  deleteLesson(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.lessonService.deleteLesson(req.user.id, lessonId);
  }
}
