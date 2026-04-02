const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
};

export default StatCard;
