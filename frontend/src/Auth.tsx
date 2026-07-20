import React, { useState } from 'react';

export default function Auth({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role] = useState('TEACHER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name, role };
    
    try {
      // Assuming backend runs on localhost:3000
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('techacher_token', data.access_token);
        onAuthSuccess(data.user);
      } else {
        alert('خطأ: ' + (data.message || 'حدث خطأ غير متوقع'));
      }
    } catch (err) {
      alert('لا يمكن الاتصال بالخادم. تأكد من تشغيل الـ Backend.');
    }
  };

  return (
    <div className="auth-container glass-panel">
      <h1 className="auth-title">Techacher</h1>
      <p className="auth-subtitle">
        {isLogin ? 'مرحباً بك مجدداً في منصتك التعليمية' : 'أنشئ حسابك وانطلق في عالم التدريس'}
      </p>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="input-group">
            <label>الاسم بالكامل</label>
            <input 
              type="text" 
              placeholder="مثال: أ. أحمد محمد" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
        )}

        <div className="input-group">
          <label>البريد الإلكتروني</label>
          <input 
            type="email" 
            placeholder="example@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label>كلمة المرور</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {!isLogin && (
          <div className="input-group">
            <label>تأكيد كلمة المرور</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {isLogin ? 'دخول' : 'إنشاء حساب'}
        </button>
      </form>

      <div className="switch-mode">
        {isLogin ? (
          <p>ليس لديك حساب؟ <span onClick={() => setIsLogin(false)}>سجل الآن</span></p>
        ) : (
          <p>لديك حساب بالفعل؟ <span onClick={() => setIsLogin(true)}>تسجيل الدخول</span></p>
        )}
      </div>
    </div>
  );
}
