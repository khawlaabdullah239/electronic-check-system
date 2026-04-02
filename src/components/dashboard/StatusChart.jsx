import { useLocale } from '../../context/LocaleContext';

const StatusChart = ({ pending = 0, cashed = 0, returned = 0 }) => {
  const { t } = useLocale();
  const total = pending + cashed + returned || 1;
  const bars = [
    { key: 'pending', count: pending, color: 'bg-amber-400', pct: Math.round((pending / total) * 100) },
    { key: 'cashed', count: cashed, color: 'bg-emerald-400', pct: Math.round((cashed / total) * 100) },
    { key: 'returned', count: returned, color: 'bg-red-400', pct: Math.round((returned / total) * 100) },
  ];

  return (
    <div className="rounded-2xl p-4 sm:p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <h3 className="font-bold mb-4" style={{ color: 'var(--text)' }}>{t('dashboard.statusDistribution')}</h3>
      <div className="space-y-4">
        {bars.map((b) => (
          <div key={b.key}>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: 'var(--text-muted)' }}>{t(`status.${b.key}`)}</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>{b.count} ({b.pct}%)</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
              <div className={`h-full rounded-full ${b.color} transition-all duration-500`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
