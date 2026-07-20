import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createQuiz(@Request() req: any, @Body() body: { lessonId: string, title: string, questions: any[] }) {
    if (req.user.role !== 'TEACHER') {
      throw new Error('Only teachers can create quizzes');
    }
    return this.quizService.createQuiz(body.lessonId, body.title, body.questions);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lesson/:lessonId')
  getQuizByLesson(@Param('lessonId') lessonId: string) {
    return this.quizService.getQuizByLesson(lessonId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lesson/:lessonId/teacher')
  getQuizWithAnswers(@Request() req: any, @Param('lessonId') lessonId: string) {
    if (req.user.role !== 'TEACHER') {
      throw new Error('Unauthorized');
    }
    return this.quizService.getQuizWithAnswers(lessonId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':quizId/submit')
  submitQuiz(@Request() req: any, @Param('quizId') quizId: string, @Body() body: { answers: { questionId: string, answerIndex: number }[] }) {
    if (req.user.role !== 'STUDENT') {
      throw new Error('Only students can submit quizzes');
    }
    return this.quizService.submitQuiz(req.user.id, quizId, body.answers);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lesson/:lessonId/results')
  getTeacherQuizResults(@Request() req: any, @Param('lessonId') lessonId: string) {
    if (req.user.role !== 'TEACHER') {
      throw new Error('Unauthorized');
    }
    return this.quizService.getTeacherQuizResults(lessonId);
  }
}
