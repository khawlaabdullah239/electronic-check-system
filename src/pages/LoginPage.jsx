import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import { QrCode, Mail, Lock, LogIn, AlertCircle, Sun, Moon, Globe, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { locale, setLocale, t, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message === 'ACCOUNT_DISABLED' ? t('auth.accountDisabled') : t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top bar with toggles */}
      <div className="fixed top-4 start-4 flex items-center gap-2 z-10">
        <button onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors cursor-pointer" style={{ color: 'var(--text-muted)' }}
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer text-sm font-medium"
          style={{ color: 'var(--text-muted)' }}>
          <Globe className="w-5 h-5" />
          {locale === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0F172A] mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{t('auth.title')}</h1>
          <p style={{ color: 'var(--text-muted)' }} className="mt-2">{t('auth.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl shadow-lg p-8 space-y-6" style={{ backgroundColor: 'var(--card)' }}>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-10 pe-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text)' }}
                placeholder="admin@echeck.sd"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                id="password" type={showPassword ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-10 pe-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text)' }}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] text-white rounded-xl font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>{t('auth.copyright')} &copy; 2026</p>
      </div>
    </div>
  );
};

export default LoginPage;
