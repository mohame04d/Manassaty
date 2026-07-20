import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':lessonId/complete')
  markAsComplete(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.markAsComplete(req.user.id, lessonId);
  }

  @Get('course/:courseId')
  getCourseProgress(@Request() req: any, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgress(req.user.id, courseId);
  }
}
