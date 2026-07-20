import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(lessonId: string, title: string, questions: any[]) {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('الدرس غير موجود');

    // Create the quiz with questions
    return this.prisma.quiz.create({
      data: {
        lessonId,
        title,
        questions: {
          create: questions.map(q => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        }
      },
      include: {
        questions: true
      }
    });
  }

  async getQuizByLesson(lessonId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          select: { id: true, text: true, options: true } // Exclude correctAnswer for students
        }
      }
    });
    
    return quiz;
  }

  async getQuizWithAnswers(lessonId: string) {
    return this.prisma.quiz.findUnique({
      where: { lessonId },
      include: { questions: true }
    });
  }

  async submitQuiz(userId: string, quizId: string, answers: { questionId: string, answerIndex: number }[]) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) throw new NotFoundException('الامتحان غير موجود');

    let score = 0;
    const total = quiz.questions.length;

    // Auto-grading
    for (const q of quiz.questions) {
      const studentAnswer = answers.find(a => a.questionId === q.id);
      if (studentAnswer && studentAnswer.answerIndex === q.correctAnswer) {
        score++;
      }
    }

    // Save result
    const result = await this.prisma.quizResult.upsert({
      where: {
        userId_quizId: { userId, quizId }
      },
      update: { score, total },
      create: { userId, quizId, score, total }
    });

    // Notify Parent
    await this.notifyParent(userId, quiz.title, score, total);

    return result;
  }

  private async notifyParent(studentId: string, quizTitle: string, score: number, total: number) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    
    if (student?.parentPhone) {
      const message = `🔔 إشعار من منصة Techacher:
مرحباً ولي أمر الطالب/ة ${student.name}،
لقد أدى الطالب امتحان "${quizTitle}" وحصل على درجة: ${score}/${total}.`;

      // Simulation of SMS/WhatsApp Notification
      console.log('\n=============================================');
      console.log('📲 [SIMULATION] SMS / WHATSAPP NOTIFICATION');
      console.log(`To: ${student.parentPhone}`);
      console.log(`Message: \n${message}`);
      console.log('=============================================\n');
    }
  }

  async getTeacherQuizResults(lessonId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { lessonId } });
    if (!quiz) return [];

    return this.prisma.quizResult.findMany({
      where: { quizId: quiz.id },
      include: {
        user: { select: { name: true, email: true, parentPhone: true } }
      },
      orderBy: { score: 'desc' }
    });
  }
}
