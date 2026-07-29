import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import toast from 'react-hot-toast';

export default function TenantStorefront() {
  const { subdomain } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [subdomain]);

  const fetchData = async () => {
    const token = localStorage.getItem('techacher_token');
    if (token) {
      // Try to fetch personalized student dashboard
      try {
        const res = await fetch(`${API_URL}/student/dashboard/${subdomain}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboard(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to load dashboard', e);
      }
    }
    
    // Fallback to public storefront
    try {
      const res = await fetch(`${API_URL}/tenant/${subdomain}`);
      const data = await res.json();
      if (res.ok) {
        setTenant(data);
        setError(null);
      } else {
        setTenant(null);
        setError(data.message || 'هذه المنصة غير موجودة');
      }
    } catch (e) {
      console.error(e);
      setError('فشل الاتصال بالخادم');
    }
    setLoading(false);
  };

  const handleBuyCourse = async (courseId: string) => {
    try {
      const res = await fetch(`${API_URL}/payment/buy/${courseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('techacher_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('تم الشراء بنجاح! يمكنك الآن مشاهدة الكورس.');
        fetchData(); // Refresh to show in My Courses
      } else {
        toast.error(data.message || 'يرجى تسجيل الدخول كطالب لشراء الكورس.');
      }
    } catch (e) {
      toast.error('خطأ في الاتصال');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>جاري التحميل...</div>;
  
  if (dashboard) {
    // Render Personalized Student Dashboard
    const getBadge = (points: number) => {
      if (points > 100) return '🥇 طالب عبقري';
      if (points > 50) return '🥈 طالب متقدم';
      if (points > 0) return '🥉 طالب مبتدئ';
      return '🌱 طالب جديد';
    };

    return (
      <div className="dashboard-container" style={{ maxWidth: '1200px' }}>
        <div className="glass-panel header" style={{ justifyContent: 'space-between', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fbbf24', margin: 0 }}>منصة أ. {dashboard.teacherName}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
              {getBadge(dashboard.stats.points)}
            </span>
            <button 
              onClick={() => { localStorage.removeItem('techacher_token'); window.location.reload(); }} 
              className="btn-logout"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>الكورسات المسجلة 📚</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>{dashboard.stats.totalPurchasedCourses}</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>الدروس المكتملة ✅</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{dashboard.stats.totalCompletedLessons}</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>النقاط 🏆</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{dashboard.stats.points}</p>
          </div>
        </div>

        {/* My Courses Section */}
        {dashboard.myCourses.length > 0 && (
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#6ee7b7' }}>🚀 كورساتي (My Learning)</h3>
            <div className="courses-grid">
              {dashboard.myCourses.map((course: any) => (
                <div key={course.id} className="course-card glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{course.title}</h4>
                  
                  <div style={{ margin: '1.5rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span>مستوى الإنجاز</span>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>{course.progressPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${course.progressPercentage}%`, background: '#10b981', height: '100%', transition: 'width 0.3s ease' }}></div>
                    </div>
                  </div>

                  <button onClick={() => navigate(`/play/${course.id}`)} className="btn-primary" style={{ background: '#6366f1', width: '100%' }}>
                    ▶️ متابعة التعلم
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses Section */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: '#818cf8' }}>✨ استكشف المزيد من الكورسات</h3>
          <div className="courses-grid">
            {dashboard.availableCourses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>لا توجد كورسات أخرى متاحة حالياً.</p>
            ) : (
              dashboard.availableCourses.map((course: any) => (
                <div key={course.id} className="course-card glass-panel" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{course.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{course.description}</p>
                  <strong style={{ color: '#34d399' }}>{course.price} ج.م</strong>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => handleBuyCourse(course.id)} className="btn-primary" style={{ background: '#10b981', width: '100%' }}>
                      شراء الكورس
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Public Storefront (Not logged in)
  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', padding: '2rem' }} className="glass-panel">
        <h2 style={{ color: '#ef4444' }}>⚠️ عذراً</h2>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '2rem' }}>
          العودة للرئيسية
        </button>
      </div>
    );
  }

  if (!tenant) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>هذه المنصة غير موجودة! تأكد من الرابط الصحيح.</div>;

  return (
    <div className="dashboard-container">
      <div className="glass-panel header" style={{ justifyContent: 'space-between', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fbbf24', margin: 0 }}>منصة أ. {tenant.user?.name}</h2>
        <div>
          <button 
            onClick={() => navigate(`/t/${subdomain}/auth`)} 
            className="btn-primary" 
            style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            تسجيل الدخول كطالب
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#6ee7b7' }}>📚 الكورسات المتاحة</h3>
        <div className="courses-grid">
          {tenant.courses.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>لا توجد كورسات متاحة حالياً.</p>
          ) : (
            tenant.courses.map((course: any) => (
              <div key={course.id} className="course-card glass-panel" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{course.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{course.description}</p>
                <strong style={{ color: '#34d399' }}>{course.price} ج.م</strong>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => navigate(`/t/${subdomain}/auth`)} className="btn-primary" style={{ background: '#10b981', flex: 1 }}>
                    شراء الكورس
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
