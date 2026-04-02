import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import { QrCode, CheckCircle, XCircle, Shield, Sun, Moon, Globe } from 'lucide-react';
import StatusBadge from '../components/check/StatusBadge';
import numberToArabicWords from '../utils/arabicWords';
import numberToEnglishWords from '../utils/englishWords';

const VerifyPublicPage = () => {
  const { checkNumber, signature } = useParams();
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const { locale, setLocale, t, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const verify = async () => {
      const { data, error } = await supabase
        .from('checks')
        .select('*')
        .eq('check_number', checkNumber)
        .eq('signature', signature)
        .single();

      if (data && !error) {
        setCheck(data);
        setValid(true);
      } else {
        setValid(false);
      }
      setLoading(false);
    };
    verify();
  }, [checkNumber, signature]);

  const getAmountInWords = () => {
    if (!check) return '';
    if (locale === 'en') {
      return numberToEnglishWords(Number(check.amount)) + ' Sudanese Pounds';
    }
    return check.amount_in_words;
  };

  const getStatusLabel = (status) => {
    return t(`status.${status}`);
  };

  if (loading) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--text-muted)' }}>{t('verify.loading')}</p>
        </div>
      </div>
    );
  }

  const fields = valid && check ? [
    [t('check.checkNumber'), check.check_number],
    [t('check.issuerName'), check.issuer_name],
    [t('check.issuerAccount'), check.issuer_account],
    [t('check.beneficiaryName'), check.beneficiary_name],
    [t('check.amount'), `${Number(check.amount).toLocaleString('en-US')} ${t('check.currency')}`],
    [t('check.amountInWords'), getAmountInWords()],
    [t('check.issueDate'), check.issue_date],
    [t('check.dueDate'), check.due_date || '—'],
    [t('check.bankName'), check.bank_name],
    [t('check.branchName'), check.branch_name || '—'],
  ] : [];

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top toggles */}
      <div className="fixed top-4 start-4 flex items-center gap-2 z-10">
        <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--text-muted)' }}>
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer text-sm font-medium"
          style={{ color: 'var(--text-muted)' }}>
          <Globe className="w-5 h-5" />
          {locale === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>

      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F172A] mb-3">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('auth.copyright')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('verify.title')}</p>
        </div>

        {valid && check ? (
          <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
            <div className="bg-emerald-50 border-b border-emerald-200 p-4 flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <span className="text-emerald-700 font-bold text-lg">{t('verify.valid')}</span>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {fields.map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-3 pe-4 font-medium w-1/3" style={{ color: 'var(--text-muted)' }}>{label}</td>
                      <td className="py-3 font-medium" style={{ color: 'var(--text)' }}>{value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 pe-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.status')}</td>
                    <td className="py-3"><StatusBadge status={check.status} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t p-4 text-center" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Shield className="w-3 h-3" />
                <span>{t('verify.verifiedAt')} {new Date().toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-center justify-center gap-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-red-700 font-bold text-lg">{t('verify.invalid')}</span>
            </div>
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-muted)' }}>{t('verify.invalidDesc')}</p>
            </div>
          </div>
        )}

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>{t('auth.copyright')} &copy; 2026</p>
      </div>
    </div>
  );
};

export default VerifyPublicPage;
