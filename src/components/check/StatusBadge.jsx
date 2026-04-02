import { useLocale } from '../../context/LocaleContext';

const COLOR_MAP = {
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  red: { bg: 'bg-red-100', text: 'text-red-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
};

const STATUS_DEFAULTS = {
  pending: 'amber',
  cashed: 'emerald',
  returned: 'red',
};

const StatusBadge = ({ status, color }) => {
  const { t } = useLocale();
  const resolvedColor = color || STATUS_DEFAULTS[status] || 'amber';
  const s = COLOR_MAP[resolvedColor] || COLOR_MAP.amber;
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {t(`status.${status}`)}
    </span>
  );
};

export default StatusBadge;
