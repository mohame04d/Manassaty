import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import toast from 'react-hot-toast';

export default function TeacherCourseManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${API_URL}/course/${id}`);
      if (res.ok) setCourse(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/lesson/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ title, videoUrl, content, order: course?.lessons?.length || 0 })
      });
      if (res.ok) {
        setTitle('');
        setVideoUrl('');
        setContent('');
        fetchCourse();
      } else {
        toast.error('حدث خطأ أثناء إضافة الدرس');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ lessonId: selectedLessonId, title: quizTitle, questions })
      });
      if (res.ok) {
        setShowQuizModal(false);
        setQuizTitle('');
        setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        fetchCourse();
        toast.success('تمت إضافة الامتحان بنجاح!');
      } else {
        const data = await res.json();
        toast.error('خطأ: ' + (data.message || 'حدث خطأ غير متوقع'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any, optionIndex?: number) => {
    const newQs = [...questions];
    if (field === 'options' && optionIndex !== undefined) {
      newQs[index].options[optionIndex] = value;
    } else {
      (newQs[index] as any)[field] = value;
    }
    setQuestions(newQs);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      const res = await fetch(`${API_URL}/lesson/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        }
      });
      if (res.ok) fetchCourse();
    } catch (e) {
      console.error(e);
    }
  };

  if (!course) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>جاري التحميل...</div>;

  return (
    <div className="dashboard-container">
      <div className="glass-panel header">
        <h2>إدارة محتوى: {course.title} 📝</h2>
        <button onClick={() => navigate('/')} className="btn-logout" style={{ color: 'white', borderColor: 'white' }}>العودة للوحة التحكم</button>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem', color: '#818cf8' }}>➕ إضافة درس جديد</h3>
          <form onSubmit={handleAddLesson}>
            <div className="input-group">
              <label>عنوان الدرس</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>رابط الفيديو (YouTube)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="input-group">
              <label>محتوى إضافي (ملاحظات)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} style={{ width: '100%', borderRadius: '12px', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>إضافة الدرس</button>
          </form>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem', color: '#34d399' }}>📑 الدروس الحالية ({course.lessons?.length || 0})</h3>
          <div className="courses-list">
            {course.lessons?.map((lesson: any) => (
              <div key={lesson.id} className="course-card glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{lesson.title}</h4>
                  {lesson.videoUrl && <span style={{ fontSize: '0.8rem', color: '#818cf8', display: 'block' }}>يحتوي على فيديو 🎥</span>}
                  {lesson.quiz && <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', fontWeight: 'bold' }}>✓ يوجد امتحان مضاف</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!lesson.quiz && (
                    <button 
                      onClick={() => { setSelectedLessonId(lesson.id); setShowQuizModal(true); }}
                      style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      ➕ إضافة امتحان
                    </button>
                  )}
                  <button onClick={() => handleDeleteLesson(lesson.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showQuizModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#fbbf24' }}>إضافة امتحان جديد 📝</h3>
            <form onSubmit={handleAddQuiz}>
              <div className="input-group">
                <label>عنوان الامتحان</label>
                <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} required placeholder="مثال: اختبار شامل على الوحدة الأولى" />
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

              {questions.map((q, qIndex) => (
                <div key={qIndex} style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#60a5fa' }}>السؤال {qIndex + 1}</h4>
                  <div className="input-group">
                    <label>نص السؤال</label>
                    <input type="text" value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} required />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="input-group" style={{ marginBottom: 0 }}>
                        <label>الخيار {optIndex + 1}</label>
                        <input type="text" value={opt} onChange={(e) => handleQuestionChange(qIndex, 'options', e.target.value, optIndex)} required />
                      </div>
                    ))}
                  </div>

                  <div className="input-group">
                    <label>الإجابة الصحيحة (اختر الرقم)</label>
                    <select value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', parseInt(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}>
                      <option value={0}>الخيار 1</option>
                      <option value={1}>الخيار 2</option>
                      <option value={2}>الخيار 3</option>
                      <option value={3}>الخيار 4</option>
                    </select>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }])} className="btn-primary" style={{ background: 'transparent', border: '1px dashed #60a5fa', color: '#60a5fa', marginBottom: '1.5rem' }}>
                ➕ إضافة سؤال آخر
              </button>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowQuizModal(false)} className="btn-primary" style={{ flex: 1, background: '#475569' }}>إلغاء</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, background: '#10b981' }}>حفظ الامتحان ✅</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
