import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Shield, User, Sun, Moon, Globe } from 'lucide-react';

const Header = () => {
  const { profile, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b hidden md:flex items-center justify-between px-6 no-print"
      style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
          {theme === 'light' ? <Moon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <Sun className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </button>
        {/* Language Toggle */}
        <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-xs font-medium"
          style={{ color: 'var(--text-muted)' }}>
          <Globe className="w-4 h-4" />
          {locale === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: 'var(--text-muted)' }}>{profile?.full_name}</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            profile?.role === 'admin'
              ? 'bg-[#A16207]/10 text-[#A16207]'
              : 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
          }`}>
            {profile?.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
            {profile?.role === 'admin' ? t('header.admin') : t('header.user')}
          </span>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
          <LogOut className="w-4 h-4" />
          {t('header.logout')}
        </button>
      </div>
    </header>
  );
};

export default Header;
