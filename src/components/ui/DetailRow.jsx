const DetailRow = ({ label, value, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-2 sm:py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
    <span className="text-sm font-medium sm:w-48 mb-1 sm:mb-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
    {children || <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--text)' }}>{value || '—'}</span>}
  </div>
);

export default DetailRow;
