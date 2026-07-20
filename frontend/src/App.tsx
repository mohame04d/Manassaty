import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import TeacherDashboard from './TeacherDashboard';
import StudentPortal from './StudentPortal';
import SuperAdminDashboard from './SuperAdminDashboard';
import TenantStorefront from './TenantStorefront';
import TeacherCourseManager from './TeacherCourseManager';
import CoursePlayer from './CoursePlayer';
import StudentAuth from './StudentAuth';
import PaymentSimulation from './PaymentSimulation';
import LandingPage from './LandingPage';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // If token exists, we could fetch user profile here. For now, we rely on the login response.
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('techacher_token');
    setUser(null);
  };

  const renderDashboard = () => {
    if (!user) return <Auth onAuthSuccess={(u) => setUser(u)} />;
    if (user.role === 'SUPERADMIN') return <SuperAdminDashboard onLogout={handleLogout} />;
    if (user.role === 'TEACHER') return <TeacherDashboard user={user} onLogout={handleLogout} />;
    if (user.role === 'STUDENT') return <StudentPortal user={user} onLogout={handleLogout} />;
    return <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" /> : <Auth onAuthSuccess={(u) => setUser(u)} />} 
        />
        <Route path="/dashboard" element={renderDashboard()} />
        <Route path="/t/:subdomain" element={<TenantStorefront />} />
        <Route path="/t/:subdomain/auth" element={<StudentAuth onAuthSuccess={(u) => setUser(u)} />} />
        <Route path="/teacher/course/:id" element={<TeacherCourseManager />} />
        <Route path="/play/:id" element={<CoursePlayer />} />
        <Route path="/payment-simulation" element={<PaymentSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;
