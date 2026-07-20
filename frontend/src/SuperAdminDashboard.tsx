import { useState, useEffect } from 'react';

export default function SuperAdminDashboard({ onLogout }: { user?: any, onLogout: () => void }) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('http://localhost:3000/subscription/teachers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleSubscription = async (teacherProfileId: string, isActive: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/subscription/toggle/${teacherProfileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('techacher_token')}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      if (res.ok) {
        fetchTeachers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="glass-panel header">
        <h2>مرحباً سوبر أدمن 🛡️</h2>
        <button onClick={onLogout} className="btn-logout">تسجيل الخروج</button>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem', color: '#f87171' }}>👨‍🏫 إدارة المعلمين واشتراكات المنصة</h3>
        
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>جاري التحميل...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>الاسم</th>
                  <th style={{ padding: '1rem' }}>البريد الإلكتروني</th>
                  <th style={{ padding: '1rem' }}>الحالة</th>
                  <th style={{ padding: '1rem' }}>تاريخ التسجيل</th>
                  <th style={{ padding: '1rem' }}>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t: any) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>{t.user?.name}</td>
                    <td style={{ padding: '1rem' }}>{t.user?.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        background: t.isActive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: t.isActive ? '#34d399' : '#f87171'
                      }}>
                        {t.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{new Date(t.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => toggleSubscription(t.id, t.isActive)}
                        className="btn-primary" 
                        style={{ 
                          padding: '0.4rem 1rem', 
                          fontSize: '0.9rem',
                          background: t.isActive ? '#ef4444' : '#10b981'
                        }}
                      >
                        {t.isActive ? 'إيقاف الاشتراك' : 'تفعيل الاشتراك'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
