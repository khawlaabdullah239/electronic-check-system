import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { FileText, ArrowRight, Printer, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import QRCodeDisplay from '../components/check/QRCode';
import StatusBadge from '../components/check/StatusBadge';
import DetailRow from '../components/ui/DetailRow';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import numberToArabicWords from '../utils/arabicWords';
import numberToEnglishWords from '../utils/englishWords';
import { SUDANESE_BANKS } from '../utils/constants';

const CheckDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t, locale } = useLocale();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [check, setCheck] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checkRes, banksRes] = await Promise.all([
          supabase.from('checks').select('*').eq('id', id).single(),
          supabase.from('banks').select('*').order('created_at'),
        ]);
        if (checkRes.error) throw checkRes.error;
        if (!checkRes.data) {
          setNotFound(true);
          return;
        }
        setCheck(checkRes.data);
        if (banksRes.data?.length) {
          setBanks(banksRes.data.map((b) => ({ ar: b.name_ar, en: b.name_en })));
        } else {
          setBanks(SUDANESE_BANKS);
        }
      } catch (err) {
        console.error('Error fetching check:', err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Auto-print when navigated with ?print=true
  useEffect(() => {
    if (check && searchParams.get('print') === 'true') {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [check, searchParams]);

  // Compute localized amount in words
  const getLocalizedAmountInWords = () => {
    if (!check) return '';
    const numAmount = parseFloat(check.amount);
    if (isNaN(numAmount) || numAmount <= 0) return check.amount_in_words || '';
    if (locale === 'en') {
      return numberToEnglishWords(numAmount) + ' Sudanese Pounds';
    }
    return numberToArabicWords(numAmount) + ' جنيه سوداني';
  };

  // Compute localized bank name
  const getLocalizedBankName = () => {
    if (!check) return '';
    const bankMatch = banks.find((b) => b.ar === check.bank_name || b.en === check.bank_name);
    if (bankMatch) {
      return locale === 'en' ? bankMatch.en : bankMatch.ar;
    }
    return check.bank_name; // fallback to stored value
  };

  if (loading) return <LoadingSpinner />;

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{t('check.notFound')}</p>
          <p style={{ color: 'var(--text-muted)' }}>{t('check.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header - hidden in print */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 no-print">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('check.details')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/checks"
            className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-75 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowRight className="w-5 h-5" />
            {t('check.back')}
          </Link>
          {isAdmin && (
            <Link
              to={`/checks/edit/${id}`}
              className="inline-flex items-center gap-2 border px-4 py-2.5 rounded-xl font-medium hover:opacity-75 transition-colors text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Pencil className="w-4 h-4" />
              {t('check.editBtn')}
            </Link>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors cursor-pointer text-sm"
          >
            <Printer className="w-4 h-4" />
            {t('check.print')}
          </button>
        </div>
      </div>

      {/* Print layout: details + QR side by side using flex */}
      <div className="print-content">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Check Details Card */}
          <div className="flex-1 rounded-2xl p-4 sm:p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text)' }}>{t('check.details')}</h3>
              <StatusBadge status={check.status} />
            </div>

            <div className="space-y-0">
              <DetailRow label={t('check.checkNumber')} value={check.check_number} />
              <DetailRow label={t('check.issuerName')} value={check.issuer_name} />
              <DetailRow label={t('check.issuerAccount')} value={check.issuer_account} />
              <DetailRow label={t('check.beneficiaryName')} value={check.beneficiary_name} />
              <DetailRow label={t('check.amount')} value={parseFloat(check.amount).toLocaleString('en-US')} />
              <DetailRow label={t('check.amountInWords')} value={getLocalizedAmountInWords()} />
              <DetailRow label={t('check.issueDate')} value={check.issue_date} />
              <DetailRow label={t('check.dueDate')} value={check.due_date} />
              <DetailRow label={t('check.bankName')} value={getLocalizedBankName()} />
              <DetailRow label={t('check.branchName')} value={check.branch_name} />
            </div>
          </div>

          {/* QR Code Card */}
          <div className="lg:w-72 rounded-2xl p-4 sm:p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4" style={{ color: 'var(--text)' }}>{t('check.qrCode')}</h3>
            <div className="flex justify-center">
              <QRCodeDisplay url={`https://electronic-check-system.netlify.app/verify/${check.check_number}/${check.signature}`} size={180} />
            </div>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              {t('verify.scanQR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckDetailPage;
