import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import toast from 'react-hot-toast';

export default function StudentAuth({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const { subdomain } = useParams();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const role = 'STUDENT';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة!');
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email, password }
      : { email, password, name, role, parentPhone };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('techacher_token', data.access_token);
        onAuthSuccess(data.user);
        navigate(`/t/${subdomain}`); // Redirect back to storefront
      } else {
        toast.error('خطأ: ' + (data.message || 'حدث خطأ غير متوقع'));
      }
    } catch (err) {
      toast.error('خطأ في الاتصال بالخادم!');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', margin: '4rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#6ee7b7' }}>
          {isLogin ? 'تسجيل دخول الطالب' : 'إنشاء حساب طالب'}
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          تسجيل الدخول لمنصة: <strong>{subdomain}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>الاسم الكامل</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>رقم هاتف ولي الأمر (لاستلام درجات الامتحانات)</label>
                <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} required placeholder="مثال: 01xxxxxxxxx" />
              </div>
            </>
          )}

          <div className="input-group">
            <label>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>تأكيد كلمة المرور</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ background: '#10b981' }}>
            {isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="switch-mode" onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
          {isLogin ? 'لا تملك حساب؟ ' : 'لديك حساب بالفعل؟ '}
          <span style={{ color: '#34d399', fontWeight: 'bold' }}>{isLogin ? 'سجل الآن' : 'سجل الدخول'}</span>
        </p>
        
        <button 
          onClick={() => navigate(`/t/${subdomain}`)} 
          style={{ width: '100%', marginTop: '1rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer' }}
        >
          العودة للمنصة
        </button>
      </div>
    </div>
  );
}
