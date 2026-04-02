import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocale } from '../../context/LocaleContext';

const AppLayout = () => {
  const { dir } = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir={dir} className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ms-64">
        {/* Mobile top bar with hamburger */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b no-print" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--text)' }}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>Electronic Check</span>
        </div>
        <Header />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
