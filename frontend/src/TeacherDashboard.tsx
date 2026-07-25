import React, { useState, useEffect } from 'react';
import { API_URL } from './config';

export default function TeacherDashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [subdomain, setSubdomain] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/analytics/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('techacher_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.subdomain) setSubdomain(data.subdomain);
        if (data.bio) setBio(data.bio);
        if (data.profileImage) setProfileImage(data.profileImage);
        if (data.experienceYears !== undefined) setExperienceYears(data.experienceYears);
        if (data.subject) setSubject(data.subject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSubdomain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-clean if the user pasted the full URL by mistake
    let cleanSub = subdomain.trim();
    if (cleanSub.includes('/t/')) {
      cleanSub = cleanSub.split('/t/').pop() || '';
    }

    try {
      const res = await fetch(`${API_URL}/tenant/subdomain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ subdomain: cleanSub })
      });
      if (res.ok) {
        alert('تم تحديث رابط المنصة بنجاح!');
      } else {
        const err = await res.json();
        alert('خطأ: ' + (err.message || 'غير معروف'));
      }
    } catch (e: any) {
      alert('خطأ في الاتصال: ' + e.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tenant/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ 
          bio, 
          profileImage, 
          experienceYears: experienceYears ? parseInt(experienceYears as string) : 0, 
          subject 
        })
      });
      if (res.ok) {
        alert('تم تحديث الملف الشخصي بنجاح!');
      } else {
        const err = await res.json();
        alert('خطأ: ' + (err.message || 'غير معروف'));
      }
    } catch (e: any) {
      alert('خطأ في الاتصال: ' + e.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/course/my-courses`, {
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
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ title, description, price: parseFloat(price) })
      });
      
      if (res.ok) {
        alert('تم إنشاء الكورس بنجاح!');
        setTitle('');
        setDescription('');
        setPrice('');
        fetchCourses();
      } else {
        const err = await res.json();
        alert('خطأ: ' + (err.message || 'لا يمكن إتمام العملية'));
      }
    } catch (e) {
      alert('حدث خطأ في الاتصال');
    }
    setLoading(false);
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch(`${API_URL}/subscription/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        // Redirect to Paymob iframe or simulated endpoint
        window.location.href = data.paymentUrl;
      } else {
        alert('خطأ: ' + (data.message || 'فشل في إنشاء الدفع'));
      }
    } catch (e) {
      alert('خطأ في الاتصال');
    }
  };

  if (!stats) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>جاري التحميل...</div>;

  // Paywall Logic
  if (!stats.isActive) {
    return (
      <div className="dashboard-container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <div className="glass-panel header" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fbbf24', margin: 0 }}>مرحباً أ. {user.name} 🎓</h2>
        </div>
        
        <div className="glass-panel" style={{ padding: '3rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>منصتك غير مفعلة حالياً 🔒</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            للبدء في إنشاء الكورسات، إضافة الطلاب، والبدء في البيع، يجب عليك تفعيل اشتراكك الشهري.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', display: 'inline-block', minWidth: '300px' }}>
            <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>باقة المدرس المحترف 🚀</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>500 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ج.م / شهرياً</span></div>
            <ul style={{ textAlign: 'right', listStyle: 'none', padding: 0, marginBottom: '2rem', lineHeight: '2' }}>
              <li>✅ عدد لا محدود من الكورسات</li>
              <li>✅ عدد لا محدود من الطلاب</li>
              <li>✅ متجر خاص (رابط باسمك)</li>
              <li>✅ مشغل فيديو محمي</li>
              <li>✅ نظام دفع ومتابعة للطلاب</li>
            </ul>
            <button onClick={handleSubscribe} className="btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
              💳 الدفع بالبطاقة / فوري
            </button>
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <button onClick={onLogout} className="btn-logout">تسجيل الخروج</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="glass-panel header" style={{ justifyContent: 'space-between', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fbbf24', margin: 0 }}>مرحباً أ. {user.name} 🎓</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#10b981' }}>
            الاشتراك ساري حتى: {new Date(stats.subscriptionEnds).toLocaleDateString('ar-EG')}
          </span>
          <button onClick={onLogout} className="btn-logout">تسجيل الخروج</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Analytics Section */}
        {stats && (
          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>إجمالي الأرباح 💰</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{stats.totalRevenue} ج.م</p>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>الطلاب المسجلين 👨‍🎓</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>{stats.totalStudents}</p>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>الكورسات المتاحة 📚</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{stats.totalCourses}</p>
            </div>
          </div>
        )}

        <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🔗 رابط المنصة الخاص بك</h3>
          
          {subdomain && (
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>انسخ هذا الرابط وشاركه مع طلابك:</span>
                <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', color: '#6ee7b7' }}>{window.location.origin}/t/{subdomain}</p>
              </div>
              <button 
                onClick={() => window.open(`${window.location.origin}/t/${subdomain}`, '_blank')}
                className="btn-primary" 
                style={{ width: 'auto', background: '#10b981', padding: '0.5rem 1rem' }}
              >
                زيارة المنصة
              </button>
            </div>
          )}

          <form onSubmit={handleUpdateSubdomain} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="مثال: mr-ahmed" 
              value={subdomain} 
              onChange={(e) => setSubdomain(e.target.value)} 
              required 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap' }}>حفظ الرابط</button>
          </form>
        </div>

        {/* Profile Settings Section */}
        <div className="glass-panel" style={{ marginBottom: '1.5rem', gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>👤 إعدادات الملف الشخصي (Marketplace)</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            هذه البيانات ستظهر للطلاب في الصفحة الرئيسية للمنصة ليستطيعوا التعرف عليك واختيارك.
          </p>
          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>رابط الصورة الشخصية (Image URL)</label>
              <input 
                type="text" 
                placeholder="https://example.com/my-photo.jpg" 
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>مادة التدريس</label>
              <input 
                type="text" 
                placeholder="مثال: فيزياء للثانوية العامة" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>سنوات الخبرة</label>
              <input 
                type="number" 
                placeholder="مثال: 5" 
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>نبذة مختصرة (Bio)</label>
              <textarea 
                placeholder="اكتب نبذة جذابة عنك وعن أسلوبك في التدريس..." 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', background: '#6366f1' }}>
                💾 حفظ الملف الشخصي
              </button>
            </div>
          </form>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem', color: '#818cf8' }}>✨ إنشاء كورس جديد</h3>
          <form onSubmit={handleCreateCourse}>
            <div className="input-group">
              <label>عنوان الكورس</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>وصف الكورس</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>السعر (ج.م)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إضافة الكورس'}
            </button>
          </form>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem', color: '#c084fc' }}>📚 كورساتي</h3>
          <div className="courses-list">
            {courses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>لم تقم بإضافة أي كورسات حتى الآن.</p>
            ) : (
              courses.map((course: any) => (
                <div key={course.id} className="course-card glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <h4>{course.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{course.description}</p>
                  <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{course.price} ج.م</p>
                  <button 
                    onClick={() => window.location.href = `/teacher/course/${course.id}`} 
                    className="btn-primary" 
                    style={{ marginTop: '0.5rem', padding: '0.4rem', fontSize: '0.9rem' }}
                  >
                    إدارة محتوى الكورس (إضافة دروس)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
