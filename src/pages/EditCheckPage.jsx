import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';
import CheckForm from '../components/check/CheckForm';
import { Pencil } from 'lucide-react';

const EditCheckPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCheck = async () => {
      try {
        const { data, error } = await supabase
          .from('checks')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (!data) {
          setNotFound(true);
          return;
        }
        setInitialData({
          checkNumber: data.check_number || '',
          issuerName: data.issuer_name || '',
          issuerAccount: data.issuer_account || '',
          beneficiaryName: data.beneficiary_name || '',
          amount: data.amount?.toString() || '',
          amountInWords: data.amount_in_words || '',
          issueDate: data.issue_date || '',
          dueDate: data.due_date || '',
          bankName: data.bank_name || '',
          branchName: data.branch_name || '',
          securityPin: data.security_pin || '',
          status: data.status || 'pending',
        });
      } catch (err) {
        console.error('Error fetching check:', err.message);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };
    fetchCheck();
  }, [id]);

  const handleSubmit = async (checkData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('checks')
        .update({
          check_number: checkData.checkNumber,
          issuer_name: checkData.issuerName,
          issuer_account: checkData.issuerAccount,
          beneficiary_name: checkData.beneficiaryName,
          amount: parseFloat(checkData.amount),
          amount_in_words: checkData.amountInWords,
          issue_date: checkData.issueDate,
          due_date: checkData.dueDate || null,
          bank_name: checkData.bankName,
          branch_name: checkData.branchName || null,
          security_pin: checkData.securityPin,
          status: checkData.status,
          signature: checkData.signature,
        })
        .eq('id', id);
      if (error) throw error;
      navigate('/checks');
    } catch (err) {
      alert(t('common.error') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--text)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center gap-3 mb-6">
        <Pencil className="w-7 h-7" style={{ color: 'var(--text)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('check.edit')}</h1>
      </div>
      <CheckForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default EditCheckPage;
