import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URL } from './config';

export default function PaymentSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const orderId = searchParams.get('order');
  const amount = searchParams.get('amount');

  const handleSimulatePayment = async () => {
    setLoading(true);

    if (orderId === 'SAAS-DEMO-999') {
      setTimeout(() => {
        alert('تم تأكيد الدفع بنجاح! 🎉 يرجى الآن إنشاء حسابك للبدء في استخدام المنصة.');
        navigate('/auth');
      }, 1500);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/subscription/verify`, {
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
        navigate('/dashboard'); 
      } else {
        alert('خطأ: ' + (data.message || 'حدث خطأ غير معروف'));
      }
    } catch (e) {
      alert('فشل الاتصال بالخادم');
    }
    setLoading(false);
  };

  if (!orderId) return <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>بيانات الدفع غير صحيحة ❌</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
        
        <div style={{ background: 'rgba(251, 191, 36, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <span style={{ fontSize: '2.5rem' }}>💳</span>
        </div>

        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.8rem' }}>بوابة الدفع الآمنة</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          أنت الآن تقوم بدفع قيمة اشتراك منصة <strong>Techacher</strong>
        </p>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>رقم الطلب:</span>
            <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{orderId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>المبلغ الإجمالي:</span>
            <strong style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>{amount} ج.م</strong>
          </div>
        </div>

        <button 
          onClick={handleSimulatePayment} 
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', background: loading ? '#374151' : 'var(--accent)', color: '#111827', marginBottom: '1rem', boxShadow: loading ? 'none' : '0 10px 20px rgba(251, 191, 36, 0.2)' }}
        >
          {loading ? 'جاري تنفيذ الدفع...' : 'تأكيد الدفع 🔒'}
        </button>

        <button 
          onClick={() => navigate('/')} 
          style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          إلغاء والعودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
