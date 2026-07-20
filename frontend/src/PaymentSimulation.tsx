import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const orderId = searchParams.get('order');
  const amount = searchParams.get('amount');

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/subscription/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ invoiceId: orderId })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert('تم الدفع وتفعيل الحساب بنجاح! 🎉');
        navigate('/'); // Go back to teacher dashboard
      } else {
        alert('خطأ: ' + (data.message || 'حدث خطأ غير معروف'));
      }
    } catch (e) {
      alert('فشل الاتصال بالخادم');
    }
    setLoading(false);
  };

  if (!orderId) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>بيانات الدفع غير صحيحة</div>;

  return (
    <div className="auth-container glass-panel" style={{ maxWidth: '500px', textAlign: 'center', marginTop: '5rem' }}>
      <h2 style={{ color: '#fbbf24', marginBottom: '1rem' }}>محاكاة بوابة الدفع (Paymob / Fawry)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        هذه الصفحة تظهر فقط في بيئة التطوير لتجربة عملية الدفع وتفعيل المنصة.
      </p>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>تفاصيل الفاتورة</h3>
        <p style={{ margin: '0.5rem 0' }}>رقم الطلب: <strong style={{ color: '#60a5fa' }}>{orderId}</strong></p>
        <p style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>المبلغ المطلوب: <strong style={{ color: '#10b981' }}>{amount} ج.م</strong></p>
      </div>

      <button 
        onClick={handleSimulatePayment} 
        disabled={loading}
        className="btn-primary" 
        style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', background: loading ? '#6b7280' : '#10b981' }}
      >
        {loading ? 'جاري المعالجة...' : '✅ محاكاة الدفع بنجاح والتفعيل'}
      </button>

      <button 
        onClick={() => navigate('/')} 
        className="btn-logout" 
        style={{ width: '100%', marginTop: '1rem' }}
      >
        إلغاء العملية والعودة
      </button>
    </div>
  );
}
