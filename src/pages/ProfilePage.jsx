import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Pencil, Lock, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import DetailRow from '../components/ui/DetailRow';

const ProfilePage = () => {
  const { t } = useLocale();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEnabled = profile?.enabled !== false;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError(t('profile.passwordMin'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('profile.passwordMismatch'));
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('profile.title')}</h1>
        </div>
        {isAdmin && (
          <Link
            to={`/users/edit/${user?.id}`}
            className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors text-sm"
          >
            <Pencil className="w-4 h-4" />
            {t('profile.editProfile')}
          </Link>
        )}
      </div>

      {/* Profile Details Card */}
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm border mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text)' }}>{t('profile.title')}</h3>
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {isEnabled ? t('users.enabled') : t('users.disabled')}
          </span>
        </div>

        <div className="space-y-0">
          <DetailRow label={t('users.fullName')} value={profile?.full_name} />
          <DetailRow label={t('users.email')} value={profile?.email || user?.email} />
          <DetailRow label={t('users.role')}>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              profile?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Shield className="w-3 h-3" />
              {profile?.role === 'admin' ? t('users.admin') : t('users.user')}
            </span>
          </DetailRow>
          <DetailRow label={t('users.createdAt')} value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'} />
        </div>
      </div>

      {/* Password Change Card */}
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Lock className="w-5 h-5" style={{ color: 'var(--text)' }} />
          <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text)' }}>{t('profile.changePassword')}</h3>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>{t('profile.newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); setPasswordSuccess(false); }}
                placeholder="••••••"
                className={inputClass}
                style={{ backgroundColor: 'var(--bg)', borderColor: passwordError ? '#DC2626' : 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>{t('profile.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); setPasswordSuccess(false); }}
                placeholder="••••••"
                className={inputClass}
                style={{ backgroundColor: 'var(--bg)', borderColor: passwordError ? '#DC2626' : 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-red-500 text-sm mt-3">{passwordError}</p>
          )}
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm mt-3">
              <Check className="w-4 h-4" />
              {t('profile.passwordChanged')}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving || !newPassword || !confirmPassword}
              className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? t('profile.saving') : t('profile.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
