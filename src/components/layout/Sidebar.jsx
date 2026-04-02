import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FilePlus, Building2, Hash, Users, UserPlus, User, QrCode, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const { t } = useLocale();
  const isAdmin = profile?.role === 'admin';

  const navItems = [
    { to: '/', label: t('nav.home'), icon: LayoutDashboard },
    { to: '/profile', label: t('nav.profile'), icon: User },
    { to: '/checks', label: t('nav.checks'), icon: FileText },
    { to: '/checks/add', label: t('nav.addCheck'), icon: FilePlus },
    ...(isAdmin ? [
      { to: '/banks', label: t('nav.banks'), icon: Building2 },
      { to: '/statuses', label: t('nav.statuses'), icon: Hash },
      { to: '/users', label: t('nav.users'), icon: Users },
      { to: '/users/add', label: t('nav.addUser'), icon: UserPlus },
    ] : []),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`w-64 bg-[#0F172A] min-h-screen fixed start-0 top-0 flex flex-col no-print z-50 transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 rtl:translate-x-full rtl:md:translate-x-0'
      }`}>
        {/* Mobile close button */}
        <button onClick={onClose} className="md:hidden absolute top-4 end-4 p-2 text-white/60 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{t('app.title')}</h1>
              <p className="text-white/50 text-xs">{t('app.subtitle')}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/' || to === '/checks' || to === '/users'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
