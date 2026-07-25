import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './config';

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [error, setError] = useState('');

  const [progress, setProgress] = useState<any>(null);
  
  // Quiz states
  const [quiz, setQuiz] = useState<any>(null);
  const [studentAnswers, setStudentAnswers] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    fetchLessons();
    fetchProgress();
  }, [id]);

  useEffect(() => {
    if (activeLesson) {
      fetchQuiz(activeLesson.id);
    }
  }, [activeLesson]);

  const fetchQuiz = async (lessonId: string) => {
    setQuiz(null);
    setQuizResult(null);
    setStudentAnswers([]);
    try {
      const res = await fetch(`${API_URL}/quiz/lesson/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('techacher_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuiz(data);
      }
    } catch (e) {
      console.error('Failed to fetch quiz', e);
    }
  };

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    const existing = studentAnswers.find(a => a.questionId === questionId);
    if (existing) {
      setStudentAnswers(studentAnswers.map(a => a.questionId === questionId ? { questionId, answerIndex } : a));
    } else {
      setStudentAnswers([...studentAnswers, { questionId, answerIndex }]);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    if (studentAnswers.length < quiz.questions.length) {
      alert('يرجى الإجابة على جميع الأسئلة أولاً.');
      return;
    }
    setSubmittingQuiz(true);
    try {
      const res = await fetch(`${API_URL}/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ answers: studentAnswers })
      });
      if (res.ok) {
        setQuizResult(await res.json());
      } else {
        alert('حدث خطأ أثناء إرسال الامتحان');
      }
    } catch (e) {
      console.error(e);
    }
    setSubmittingQuiz(false);
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/course/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('techacher_token')}` }
      });
      if (res.ok) setProgress(await res.json());
    } catch (e) {
      console.error('Failed to fetch progress');
    }
  };

  const handleMarkAsComplete = async (lessonId: string) => {
    try {
      const res = await fetch(`${API_URL}/progress/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('techacher_token')}` }
      });
      if (res.ok) {
        fetchProgress();
      }
    } catch (e) {
      alert('خطأ أثناء تحديث التقدم');
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API_URL}/lesson/course/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0]);
      } else {
        const err = await res.json();
        setError(err.message || 'غير مصرح لك بمشاهدة هذا الكورس');
      }
    } catch (e) {
      setError('خطأ في الاتصال بالخادم');
    }
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (error) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: '#ef4444' }}>⚠️ {error}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginTop: '2rem' }}>رجوع للخلف</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ maxWidth: '1400px' }}>
      <div className="glass-panel header" style={{ padding: '1rem 2rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>شاشة العرض (Course Player) 📺</h2>
        <button onClick={() => navigate(-1)} className="btn-logout" style={{ color: 'white', borderColor: 'white' }}>الخروج من المشغل</button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '3fr 1fr' }}>
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          {activeLesson ? (
            <div>
              {activeLesson.videoUrl && extractYoutubeId(activeLesson.videoUrl) ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={`https://www.youtube.com/embed/${extractYoutubeId(activeLesson.videoUrl)}`} 
                    allowFullScreen>
                  </iframe>
                </div>
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>لا يوجد فيديو لهذا الدرس.</div>
              )}
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#6ee7b7', margin: 0 }}>{activeLesson.title}</h2>
                  {!progress?.completedLessons?.includes(activeLesson.id) ? (
                    <button onClick={() => handleMarkAsComplete(activeLesson.id)} className="btn-primary" style={{ background: '#3b82f6', width: 'auto' }}>
                      ✔️ وضع علامة كمكتمل
                    </button>
                  ) : (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>✅ اكتمل الدرس</span>
                  )}
                </div>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '2rem' }}>{activeLesson.content}</p>

                {/* Quiz Section */}
                {quiz && (
                  <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <h3 style={{ color: '#fbbf24', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📝 امتحان الدرس: {quiz.title}</h3>
                    
                    {quizResult ? (
                      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                        <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>🎉 تم تسليم الامتحان بنجاح!</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>نتيجتك هي:</p>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
                          {quizResult.score} / {quizResult.total}
                        </div>
                        <p style={{ color: '#6ee7b7' }}>تم إرسال نتيجتك لولي أمرك عبر رسالة خاصة. 📲</p>
                      </div>
                    ) : (
                      <div className="quiz-container">
                        {quiz.questions.map((q: any, qIndex: number) => {
                          const selectedAnswer = studentAnswers.find(a => a.questionId === q.id)?.answerIndex;
                          return (
                            <div key={q.id} className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#fff' }}>
                                <span style={{ color: '#60a5fa', marginRight: '0.5rem' }}>{qIndex + 1}.</span> {q.text}
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {q.options.map((opt: string, oIndex: number) => (
                                  <label 
                                    key={oIndex} 
                                    style={{ 
                                      display: 'flex', alignItems: 'center', padding: '1rem', 
                                      background: selectedAnswer === oIndex ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0,0,0,0.2)', 
                                      border: `1px solid ${selectedAnswer === oIndex ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, 
                                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' 
                                    }}
                                  >
                                    <input 
                                      type="radio" 
                                      name={`question_${q.id}`} 
                                      checked={selectedAnswer === oIndex}
                                      onChange={() => handleSelectAnswer(q.id, oIndex)}
                                      style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                                    />
                                    <span style={{ fontSize: '1rem' }}>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        <button 
                          onClick={handleSubmitQuiz} 
                          disabled={submittingQuiz}
                          className="btn-primary" 
                          style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', background: submittingQuiz ? '#64748b' : '#10b981' }}
                        >
                          {submittingQuiz ? 'جاري التصحيح وإرسال النتيجة...' : 'تسليم الامتحان 🚀'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل أو لا توجد دروس متاحة...</div>
          )}
        </div>

        <div className="glass-panel" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>قائمة الدروس</h3>
          
          {progress && (
            <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>مستوى تقدمك:</span>
                <span style={{ fontWeight: 'bold', color: '#6ee7b7' }}>{progress.percentage}%</span>
              </div>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${progress.percentage}%`, background: '#10b981', height: '100%', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {lessons.map((lesson, idx) => {
              const isCompleted = progress?.completedLessons?.includes(lesson.id);
              return (
                <button 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{ 
                    textAlign: 'right', 
                    padding: '1rem', 
                    background: activeLesson?.id === lesson.id ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${activeLesson?.id === lesson.id ? '#34d399' : 'transparent'}`,
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{idx + 1}. {lesson.title}</span>
                  {isCompleted && <span>✅</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
