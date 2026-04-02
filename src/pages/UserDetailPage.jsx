import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, ArrowRight, Pencil, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import DetailRow from '../components/ui/DetailRow';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const UserDetailPage = () => {
  const { id } = useParams();
  const { t } = useLocale();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (!data) {
          setNotFound(true);
          return;
        }
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user:', err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{t('users.notFound')}</p>
        </div>
      </div>
    );
  }

  const isSelf = userData.id === currentUser?.id;
  const isEnabled = userData.enabled !== false;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('users.details')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-75 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowRight className="w-5 h-5" />
            {t('users.back')}
          </Link>
          {!isSelf && (
            <Link
              to={`/users/edit/${userData.id}`}
              className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors text-sm"
            >
              <Pencil className="w-4 h-4" />
              {t('users.edit')}
            </Link>
          )}
        </div>
      </div>

      {/* Details Card */}
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text)' }}>{t('users.details')}</h3>
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {isEnabled ? t('users.enabled') : t('users.disabled')}
          </span>
        </div>

        <div className="space-y-0">
          <DetailRow label={t('users.fullName')} value={userData.full_name} />
          <DetailRow label={t('users.email')} value={userData.email} />
          <DetailRow label={t('users.role')}>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              userData.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Shield className="w-3 h-3" />
              {userData.role === 'admin' ? t('users.admin') : t('users.user')}
            </span>
          </DetailRow>
          <DetailRow label={t('users.status')}>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {isEnabled ? t('users.enabled') : t('users.disabled')}
            </span>
          </DetailRow>
          <DetailRow label={t('users.createdAt')} value={userData.created_at ? new Date(userData.created_at).toLocaleDateString() : '—'} />
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
