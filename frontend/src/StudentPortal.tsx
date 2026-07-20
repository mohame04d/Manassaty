import { useState, useEffect } from 'react';

export default function StudentPortal({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:3000/course/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleBuyCourse = async (courseId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/payment/buy/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('تم الشراء بنجاح! يمكنك الآن مشاهدة الكورس.');
        window.location.href = `/play/${courseId}`;
      } else {
        alert(data.message || 'حدث خطأ أثناء الشراء');
      }
    } catch (e) {
      alert('خطأ في الاتصال');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="glass-panel header">
        <h2>مرحباً يا {user.name} 🎓</h2>
        <button onClick={onLogout} className="btn-logout">تسجيل الخروج</button>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem', color: '#6ee7b7' }}>🚀 اكتشف الكورسات المتاحة</h3>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>جاري التحميل...</p>
        ) : (
          <div className="courses-grid">
            {courses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>لا توجد كورسات متاحة حالياً.</p>
            ) : (
              courses.map((course: any) => (
                <div key={course.id} className="course-card glass-panel" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{course.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{course.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      المعلم: {course.teacherProfile?.user?.name || 'غير معروف'}
                    </span>
                    <strong style={{ color: '#34d399' }}>{course.price} ج.م</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => handleBuyCourse(course.id)} className="btn-primary" style={{ background: '#10b981', flex: 1 }}>
                      شراء الكورس
                    </button>
                    <button onClick={() => window.location.href = `/play/${course.id}`} className="btn-primary" style={{ background: '#6366f1', flex: 1 }}>
                      الذهاب للكورس
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
