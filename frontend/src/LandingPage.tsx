import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

export default function LandingPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_URL}/tenant/active-teachers`);
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
        <nav className="flex-responsive" style={{ padding: '1.5rem 0', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🚀</span>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
              Techa<span style={{ color: 'var(--accent)' }}>cher</span>
            </h1>
          </div>
          <div className="flex-responsive" style={{ gap: '2rem' }}>
            <div className="nav-links" style={{ fontWeight: 'bold' }}>
              <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>المميزات</a>
              <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>من نحن</a>
              <a href="#pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>الأسعار</a>
              <a href="#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>الأسئلة الشائعة</a>
            </div>
            <div className="nav-buttons">
              <button 
                onClick={() => navigate('/auth')} 
                className="btn-primary" 
                style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '30px' }}
              >
                دخول
              </button>
              <button 
                onClick={() => navigate('/auth')} 
                className="btn-primary" 
                style={{ background: 'var(--accent)', color: '#111827', borderRadius: '30px', boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)' }}
              >
                ابدأ التدريس
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '6rem 0', marginBottom: '4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: '0.3', zIndex: '0' }}></div>
          <div style={{ position: 'relative', zIndex: '1' }}>
            <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'var(--glass-bg)', color: 'var(--accent)', borderRadius: '30px', marginBottom: '1.5rem', fontWeight: 'bold', border: '1px solid var(--accent)' }}>
              🎓 المنصة التعليمية الأولى في مصر
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1.5rem', fontWeight: '900', lineHeight: '1.2' }}>
              تعلم مع <span style={{ color: 'var(--accent)' }}>نخبة المدرسين</span><br />في أي وقت ومكان
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.8' }}>
              منصة Techacher تجمع لك أفضل المعلمين لتوفير تجربة تعليمية تفاعلية وحصرية. تصفح المدرسين المتاحين واشترك في كورساتهم بضغطة زر.
            </p>
            <button 
              onClick={() => document.getElementById('teachers-section')?.scrollIntoView({ behavior: 'smooth' })} 
              className="btn-primary" 
              style={{ fontSize: '1.2rem', padding: '1rem 3rem', background: 'var(--primary)', borderRadius: '30px', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)', transition: 'transform 0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              استكشف المدرسين الآن 👇
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" style={{ padding: '4rem 0', textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '3rem', color: 'var(--accent)' }}>لماذا منصتي؟ 💡</h2>
          <div className="grid-responsive">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>منصتك المستقلة</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>رابط خاص بك تماماً يحمل اسمك لتعزيز علامتك التجارية كمدرس محترف.</p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>تصحيح آلي للامتحانات</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>وفر وقتك وجهدك، النظام يقوم بتصحيح الامتحانات للطلاب بشكل فوري وموثوق.</p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>تنبيهات أولياء الأمور</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>تصل درجات الطالب ونتائجه فوراً لولي الأمر عبر رسائل نصية للمتابعة الدقيقة.</p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>دفع إلكتروني متكامل</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>استلم أموالك بسهولة عن طريق محافظ فودافون كاش وكروت الدفع البنكية.</p>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div id="about" className="glass-panel flex-responsive" style={{ padding: '4rem 2rem', marginBottom: '5rem' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1.5rem', color: 'var(--accent)' }}>من نحن؟ 🌍</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.8', marginBottom: '1rem' }}>
              نحن في **منصتي** نؤمن أن التكنولوجيا هي المعلم الثاني. قمنا ببناء هذه المنصة خصيصاً لتلبية احتياجات المدرس المصري والعربي، بعيداً عن تعقيدات البرمجة وبناء المواقع.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
              مهمتنا هي تمكينك من التركيز على ما تتقنه (التدريس والإبداع)، بينما نتكفل نحن بـ (الاستضافة، الحماية، الدفع، التصحيح، ومتابعة الطلاب).
            </p>
          </div>
          <div style={{ flex: '1 1 400px', width: '100%', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', borderRadius: '20px', padding: '3rem', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)' }}>
              <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>+10,000 طالب</h3>
              <p style={{ color: 'var(--accent)' }}>يتعلمون يومياً عبر منصتنا</p>
            </div>
          </div>
        </div>

        {/* Marketplace Section */}
        <div id="teachers-section" style={{ marginBottom: '6rem', position: 'relative', zIndex: '1' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>معلمونا المتميزون ✨</h2>
            <div style={{ width: '60px', height: '4px', background: 'var(--accent)', margin: '0 auto', borderRadius: '2px' }}></div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.5rem', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(251, 191, 36, 0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ marginTop: '1rem' }}>جاري تحميل المدرسين...</p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏜️</span>
              <h3>لا يوجد مدرسين متاحين حالياً</h3>
              <p>كن أول من يطلق منصته التعليمية معنا!</p>
            </div>
          ) : (
            <div className="grid-responsive">
              {teachers.map(teacher => (
                <div key={teacher.id} className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
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
                      style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: '4px solid #1e293b', boxShadow: '0 0 0 4px var(--primary)' }}
                    />
                    <div style={{ position: 'absolute', bottom: '5px', right: '-5px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '2px solid #1e293b' }}>
                      مُفعل ✓
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#fff' }}>أ. {teacher.user.name}</h3>
                  {teacher.subject && <p style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>{teacher.subject}</p>}
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                    {teacher.bio || 'مدرس متميز يقدم محتوى تعليمي تفاعلي.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ textAlign: 'center', padding: '0 1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '1.2rem' }}>15</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>كورس</span>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '1.2rem' }}>+500</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>طالب</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.open(`/t/${teacher.tenantId}`, '_blank')}
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem', 
                      background: 'transparent', 
                      border: '1px solid var(--primary)', 
                      color: 'var(--primary)', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
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

        {/* Pricing Section */}
        <div id="pricing" style={{ padding: '4rem 0', textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem', color: 'var(--accent)' }}>الأسعار والاشتراكات 💰</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>اختر الباقة المناسبة لحجم طلابك</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', position: 'relative', transform: 'scale(1.05)', borderColor: 'var(--accent)', boxShadow: '0 0 30px rgba(251, 191, 36, 0.15)' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#111827', padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.95rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>الباقة الشاملة ⭐️</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>الباقة المتقدمة</h3>
              <div style={{ fontSize: '2.5rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '2rem' }}>500 ج.م <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ شهرياً</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'right', color: 'var(--text-main)', lineHeight: '2' }}>
                <li>✅ رابط منصة خاص بك</li>
                <li>✅ عدد طلاب غير محدود</li>
                <li>✅ مساحة تخزين فيديوهات غير محدودة</li>
                <li>✅ تصحيح آلي للامتحانات</li>
                <li>✅ إرسال تقارير لأولياء الأمور (SMS)</li>
                <li>✅ دعم فني على مدار الساعة</li>
                <li>✅ بوابة دفع متكاملة</li>
              </ul>
              <button onClick={() => navigate('/payment-simulation?order=SAAS-DEMO-999&amount=500')} className="btn-primary" style={{ width: '100%', background: 'var(--primary)', color: 'white', fontSize: '1.1rem' }}>اشترك الآن 🚀</button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" style={{ padding: '4rem 0', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '3rem', color: 'var(--accent)', textAlign: 'center' }}>الأسئلة الشائعة ❓</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>هل أحتاج لمعرفة البرمجة لإنشاء منصتي؟</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>لا، إطلاقاً! بمجرد التسجيل ستصبح منصتك جاهزة خلال ثوانٍ، وكل ما عليك هو إضافة محتواك.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>كيف يستطيع الطلاب الدفع لي؟</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>نحن نوفر ربطاً جاهزاً مع بوابات الدفع المحلية في مصر والوطن العربي، يمكن للطلاب الدفع عن طريق فودافون كاش، محافظ المحمول، أو البطاقات البنكية لتصلك أموالك مباشرة.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>هل يمكنني استخراج تقارير لأولياء الأمور؟</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>بالتأكيد! النظام يتيح إرسال نتائج الامتحانات وتقارير الغياب والحضور تلقائياً إلى هواتف أولياء الأمور عبر الرسائل القصيرة.</p>
            </div>
          </div>
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
