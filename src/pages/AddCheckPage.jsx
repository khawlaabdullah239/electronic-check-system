import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { supabase } from '../lib/supabase';
import CheckForm from '../components/check/CheckForm';
import { FilePlus } from 'lucide-react';

const AddCheckPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleSubmit = async (checkData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('checks').insert({
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
        created_by: user.id,
      });
      if (error) throw error;
      navigate('/checks');
    } catch (err) {
      alert(t('common.error') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FilePlus className="w-7 h-7" style={{ color: 'var(--text)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('check.addNew')}</h1>
      </div>
      <CheckForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default AddCheckPage;
