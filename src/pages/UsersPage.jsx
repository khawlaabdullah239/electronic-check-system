import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Eye, Pencil, Trash2, Plus, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const UsersPage = () => {
  const { t } = useLocale();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleEnabled = async (userId, currentEnabled) => {
    setTogglingId(userId);
    const { error } = await supabase.from('profiles').update({ enabled: !currentEnabled }).eq('id', userId);
    if (!error) fetchUsers();
    else alert(t('common.error'));
    setTogglingId(null);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(t('users.deleteConfirm'))) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) fetchUsers();
    else alert(t('common.error'));
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header with title + Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('users.title')}</h1>
        </div>
        <Link
          to="/users/add"
          className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('users.addNew')}
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder={t('users.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          className="w-full ps-10 pe-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl p-12 shadow-sm border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('users.noData')}</p>
        </div>
      ) : (
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('users.name')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('users.email')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('users.role')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('users.status')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('users.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const isEnabled = u.enabled !== false;
                  return (
                    <tr key={u.id} className="border-b last:border-b-0 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-4 px-4 font-medium" style={{ color: 'var(--text)' }}>
                        {u.full_name || '—'}
                      </td>
                      <td className="py-4 px-4" style={{ color: 'var(--text-muted)' }}>
                        {u.email || '—'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          <Shield className="w-3 h-3" />
                          {u.role === 'admin' ? t('users.admin') : t('users.user')}
                        </span>
                      </td>
                      {/* Status column with label + toggle */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isEnabled ? t('users.enabled') : t('users.disabled')}
                          </span>
                          {!isSelf && (
                            <button
                              onClick={() => handleToggleEnabled(u.id, isEnabled)}
                              disabled={togglingId === u.id}
                              aria-label={isEnabled ? t('users.disable') : t('users.enable')}
                              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50"
                              style={{ backgroundColor: isEnabled ? '#059669' : '#d1d5db' }}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm ${
                                  isEnabled ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0.5 rtl:-translate-x-0.5'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </td>
                      {/* Actions column with inline buttons */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/users/${u.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75"
                            style={{ color: 'var(--text)' }}
                          >
                            <Eye className="w-4 h-4" />
                            {t('users.view')}
                          </Link>
                          {!isSelf && (
                            <>
                              <Link
                                to={`/users/edit/${u.id}`}
                                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75"
                                style={{ color: 'var(--text)' }}
                              >
                                <Pencil className="w-4 h-4" />
                                {t('users.edit')}
                              </Link>
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('users.delete')}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
