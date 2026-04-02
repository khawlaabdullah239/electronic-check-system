import { useLocale } from '../../context/LocaleContext';

const LoadingSpinner = () => {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--text)', borderTopColor: 'transparent' }} />
        <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
