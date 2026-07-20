import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('http://localhost:3000/tenant/active-teachers');
      if (res.ok) {
        setTeachers(await res.json());
      }
    } catch (e) {
      console.error('Failed to load teachers', e);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: 'white', fontFamily: "'Inter', 'Tajawal', sans-serif" }}>
      <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Navbar */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🚀</span>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
              Techa<span style={{ color: '#10b981' }}>cher</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/auth')} 
              className="btn-primary" 
              style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '0.6rem 1.5rem', borderRadius: '30px' }}
            >
              دخول
            </button>
            <button 
              onClick={() => navigate('/auth')} 
              className="btn-primary" 
              style={{ background: '#10b981', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
            >
              ابدأ التدريس
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '6rem 0', marginBottom: '4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: '#10b981', filter: 'blur(150px)', opacity: '0.2', zIndex: '0' }}></div>
          <div style={{ position: 'relative', zIndex: '1' }}>
            <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '30px', marginBottom: '1.5rem', fontWeight: 'bold', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              🎓 المنصة التعليمية الأولى في مصر
            </span>
            <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: '900', lineHeight: '1.2' }}>
              تعلم مع <span style={{ color: '#10b981' }}>نخبة المدرسين</span><br />في أي وقت ومكان
            </h1>
            <p style={{ fontSize: '1.3rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.8' }}>
              منصة Techacher تجمع لك أفضل المعلمين لتوفير تجربة تعليمية تفاعلية وحصرية. تصفح المدرسين المتاحين واشترك في كورساتهم بضغطة زر.
            </p>
            <button 
              onClick={() => document.getElementById('teachers-section')?.scrollIntoView({ behavior: 'smooth' })} 
              className="btn-primary" 
              style={{ fontSize: '1.2rem', padding: '1rem 3rem', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '30px', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'transform 0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              استكشف المدرسين الآن 👇
            </button>
          </div>
        </div>

        {/* Marketplace Section */}
        <div id="teachers-section" style={{ marginBottom: '6rem', position: 'relative', zIndex: '1' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>معلمونا المتميزون ✨</h2>
            <div style={{ width: '60px', height: '4px', background: '#10b981', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.5rem', padding: '4rem 0', color: '#94a3b8' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(16, 185, 129, 0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ marginTop: '1rem' }}>جاري تحميل المدرسين...</p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', color: '#94a3b8', padding: '4rem', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏜️</span>
              <h3>لا يوجد مدرسين متاحين حالياً</h3>
              <p>كن أول من يطلق منصته التعليمية معنا!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
              {teachers.map(teacher => (
                <div key={teacher.id} className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <img 
                      src={teacher.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + teacher.user.name} 
                      alt={teacher.user.name} 
                      style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: '4px solid #1e293b', boxShadow: '0 0 0 4px #10b981' }}
                    />
                    <div style={{ position: 'absolute', bottom: '5px', right: '-5px', background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '2px solid #1e293b' }}>
                      مُفعل ✓
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#fff' }}>أ. {teacher.user.name}</h3>
                  {teacher.subject && <p style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>{teacher.subject}</p>}
                  
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                    {teacher.bio || 'مدرس متميز على منصة Techacher يقدم محتوى تعليمي تفاعلي.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ padding: '0 1rem' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>سنوات الخبرة</span>
                      <strong style={{ color: '#fbbf24', fontSize: '1.2rem' }}>{teacher.experienceYears ? `+${teacher.experienceYears}` : '-'}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/t/${teacher.subdomain}`)}
                    className="btn-primary" 
                    style={{ width: '100%', background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '12px', transition: 'all 0.3s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#10b981';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#10b981';
                    }}
                  >
                    تصفح الكورسات 🚀
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚀</span>
            <strong style={{ color: '#fff', fontSize: '1.2rem' }}>Techacher SaaS</strong>
          </div>
          <p>© 2026 جميع الحقوق محفوظة لشركة Techacher التعليمية.</p>
        </footer>
      </div>
    </div>
  );
}
