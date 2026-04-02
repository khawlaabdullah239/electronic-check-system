import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import StatusBadge from '../components/check/StatusBadge';

const DashboardPage = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const { data, error } = await supabase.from('checks').select('*');
        if (error) throw error;
        setChecks(data || []);
      } catch (err) {
        console.error('Error fetching checks:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChecks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--text)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const totalCount = checks.length;
  const totalAmount = checks.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const today = new Date().toISOString().split('T')[0];
  const overdueCount = checks.filter(
    (c) => c.due_date && c.due_date < today && c.status === 'pending'
  ).length;
  const cashedCount = checks.filter((c) => c.status === 'cashed').length;
  const pendingCount = checks.filter((c) => c.status === 'pending').length;
  const returnedCount = checks.filter((c) => c.status === 'returned').length;

  const recentChecks = [...checks]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>{t('dashboard.title')}</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label={t('dashboard.totalChecks')} value={totalCount.toLocaleString('en-US')} color="blue" />
        <StatCard icon={DollarSign} label={t('dashboard.totalAmount')} value={totalAmount.toLocaleString('en-US')} color="green" />
        <StatCard icon={AlertCircle} label={t('dashboard.overdueChecks')} value={overdueCount.toLocaleString('en-US')} color="red" />
        <StatCard icon={CheckCircle} label={t('dashboard.cashedChecks')} value={cashedCount.toLocaleString('en-US')} color="amber" />
      </div>

      {/* Recent Checks Table + Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Checks Table */}
        <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--text)' }}>{t('dashboard.recentChecks')}</h3>
          {recentChecks.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>{t('dashboard.noChecks')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <th className="text-start py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.checkNumber')}</th>
                    <th className="text-start py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.beneficiaryName')}</th>
                    <th className="text-start py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.amount')}</th>
                    <th className="text-start py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChecks.map((check) => (
                    <tr key={check.id} className="border-b last:border-b-0 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 px-2">
                        <Link to={`/checks/${check.id}`} className="font-medium transition-colors hover:opacity-75" style={{ color: 'var(--text)' }}>
                          {check.check_number}
                        </Link>
                      </td>
                      <td className="py-3 px-2" style={{ color: 'var(--text)' }}>{check.beneficiary_name}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--text)' }}>{parseFloat(check.amount).toLocaleString('en-US')}</td>
                      <td className="py-3 px-2"><StatusBadge status={check.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Chart */}
        <StatusChart pending={pendingCount} cashed={cashedCount} returned={returnedCount} />
      </div>
    </div>
  );
};

export default DashboardPage;
