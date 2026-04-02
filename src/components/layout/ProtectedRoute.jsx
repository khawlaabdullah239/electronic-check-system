import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--text)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-muted)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profile?.enabled === false) return <Navigate to="/login" replace />;
  if (requiredRole && profile?.role !== requiredRole) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
