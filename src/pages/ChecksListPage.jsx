import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Pencil, Trash2, Plus, Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import StatusBadge from '../components/check/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ChecksListPage = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { profile } = useAuth();
  const { t } = useLocale();

  const isAdmin = profile?.role === 'admin';

  const fetchChecks = async () => {
    try {
      const { data, error } = await supabase
        .from('checks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChecks(data || []);
    } catch (err) {
      console.error('Error fetching checks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('check.deleteConfirm'))) return;
    try {
      const { error } = await supabase.from('checks').delete().eq('id', id);
      if (error) throw error;
      setChecks((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(t('common.error') + ': ' + err.message);
    }
  };

  const filteredChecks = checks.filter((check) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      check.check_number?.toLowerCase().includes(query) ||
      check.beneficiary_name?.toLowerCase().includes(query)
    );
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('nav.checks')}</h1>
        <Link
          to="/checks/add"
          className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('check.addNew')}
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder={t('check.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full ps-10 pe-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Table */}
      {filteredChecks.length === 0 ? (
        <div className="rounded-2xl p-12 shadow-sm border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('check.noResults')}</p>
        </div>
      ) : (
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.checkNumber')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.beneficiaryName')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.amount')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.dueDate')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.status')}</th>
                  <th className="text-start py-4 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredChecks.map((check) => (
                  <tr
                    key={check.id}
                    className="border-b last:border-b-0 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="py-4 px-4 font-medium" style={{ color: 'var(--text)' }}>{check.check_number}</td>
                    <td className="py-4 px-4" style={{ color: 'var(--text)' }}>{check.beneficiary_name}</td>
                    <td className="py-4 px-4" style={{ color: 'var(--text)' }}>{parseFloat(check.amount).toLocaleString('en-US')}</td>
                    <td className="py-4 px-4" style={{ color: 'var(--text)' }}>{check.due_date || '—'}</td>
                    <td className="py-4 px-4"><StatusBadge status={check.status} /></td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/checks/${check.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75"
                          style={{ color: 'var(--text)' }}
                        >
                          <Eye className="w-4 h-4" />
                          {t('check.view')}
                        </Link>
                        <Link
                          to={`/checks/${check.id}?print=true`}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75"
                          style={{ color: 'var(--text)' }}
                        >
                          <Printer className="w-4 h-4" />
                          {t('check.print')}
                        </Link>
                        {isAdmin && (
                          <>
                            <Link
                              to={`/checks/edit/${check.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75"
                              style={{ color: 'var(--text)' }}
                            >
                              <Pencil className="w-4 h-4" />
                              {t('check.editBtn')}
                            </Link>
                            <button
                              onClick={() => handleDelete(check.id)}
                              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t('check.delete')}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecksListPage;
