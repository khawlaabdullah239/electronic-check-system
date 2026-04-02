import { useState, useEffect } from 'react';
import {
  Hash,
  User,
  CreditCard,
  DollarSign,
  Calendar,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { supabase } from '../../lib/supabase';
import { SUDANESE_BANKS, STATUS_OPTIONS } from '../../utils/constants';
import numberToArabicWords from '../../utils/arabicWords';
import numberToEnglishWords from '../../utils/englishWords';
import { generateHash } from '../../utils/crypto';

const defaultFormData = {
  checkNumber: '',
  issuerName: '',
  issuerAccount: '',
  beneficiaryName: '',
  amount: '',
  amountInWords: '',
  issueDate: '',
  dueDate: '',
  bankName: '',
  branchName: '',
  securityPin: '',
  status: 'pending',
};

const CheckForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(() => ({
    ...defaultFormData,
    ...initialData,
  }));
  const [errors, setErrors] = useState({});
  const [showPin, setShowPin] = useState(false);
  const [banks, setBanks] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const { t, locale } = useLocale();

  // Fetch banks and statuses from Supabase, fallback to constants
  useEffect(() => {
    const fetchData = async () => {
      const [banksRes, statusRes] = await Promise.all([
        supabase.from('banks').select('*').order('created_at'),
        supabase.from('statuses').select('*').order('created_at'),
      ]);
      if (banksRes.data?.length) {
        setBanks(banksRes.data.map((b) => ({ ar: b.name_ar, en: b.name_en })));
      } else {
        setBanks(SUDANESE_BANKS);
      }
      if (statusRes.data?.length) {
        setStatusOptions(statusRes.data.map((s) => ({ value: s.value, color: s.color })));
      } else {
        setStatusOptions(STATUS_OPTIONS);
      }
    };
    fetchData();
  }, []);

  const bankLabel = (bank) => locale === 'en' ? bank.en : bank.ar;

  useEffect(() => {
    const numAmount = parseFloat(formData.amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      const words = locale === 'en'
        ? numberToEnglishWords(numAmount) + ' Sudanese Pounds'
        : numberToArabicWords(numAmount) + ' جنيه سوداني';
      setFormData((prev) => ({ ...prev, amountInWords: words }));
    } else {
      setFormData((prev) => ({ ...prev, amountInWords: '' }));
    }
  }, [formData.amount, locale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, securityPin: value }));
    if (errors.securityPin) {
      setErrors((prev) => ({ ...prev, securityPin: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.checkNumber.trim()) newErrors.checkNumber = t('check.required');
    if (!formData.issuerName.trim()) newErrors.issuerName = t('check.required');
    if (!formData.issuerAccount.trim()) newErrors.issuerAccount = t('check.required');
    if (!formData.beneficiaryName.trim()) newErrors.beneficiaryName = t('check.required');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = t('check.required');
    if (!formData.issueDate) newErrors.issueDate = t('check.required');
    if (!formData.bankName) newErrors.bankName = t('check.required');
    if (!formData.securityPin || formData.securityPin.length !== 4) newErrors.securityPin = t('check.pinError');
    if (!formData.status) newErrors.status = t('check.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const signature = await generateHash(
      JSON.stringify(formData) + formData.securityPin
    );
    await onSubmit({ ...formData, signature });
  };

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const renderField = ({ label, name, icon: Icon, type = 'text', required = false, readOnly = false, autoComplete, children }) => (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      <div className="relative">
        <Icon
          className="absolute start-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
          size={18}
        />
        {children || (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            readOnly={readOnly}
            autoComplete={autoComplete || 'off'}
            className={`w-full ps-10 pe-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all ${readOnly ? 'opacity-60' : ''}`}
            style={inputStyle}
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
      {/* Hidden decoy fields to absorb Chrome autofill */}
      <input type="text" name="fake_user" autoComplete="username" className="hidden" tabIndex={-1} aria-hidden="true" />
      <input type="password" name="fake_pass" autoComplete="current-password" className="hidden" tabIndex={-1} aria-hidden="true" />

      {/* Row 1: Check Number + Issue Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField({ label: t('check.checkNumber'), name: 'checkNumber', icon: Hash, required: true })}
        {renderField({
          label: t('check.issueDate'), name: 'issueDate', icon: Calendar, type: 'date', required: true,
          children: (
            <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full ps-10 pe-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={inputStyle} />
          ),
        })}
      </div>

      {/* Row 2: Issuer Name + Issuer Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField({ label: t('check.issuerName'), name: 'issuerName', icon: User, required: true })}
        {renderField({ label: t('check.issuerAccount'), name: 'issuerAccount', icon: CreditCard, required: true })}
      </div>

      {/* Row 3: Beneficiary + Amount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField({ label: t('check.beneficiaryName'), name: 'beneficiaryName', icon: User, required: true })}
        {renderField({ label: t('check.amount'), name: 'amount', icon: DollarSign, type: 'number', required: true })}
      </div>

      {/* Row 4: Amount in Words + Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField({ label: t('check.amountInWords'), name: 'amountInWords', icon: DollarSign, readOnly: true })}
        {renderField({
          label: t('check.dueDate'), name: 'dueDate', icon: Calendar, type: 'date',
          children: (
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
              className="w-full ps-10 pe-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={inputStyle} />
          ),
        })}
      </div>

      {/* Row 5: Bank + Branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField({
          label: t('check.bankName'), name: 'bankName', icon: Building2, required: true,
          children: (
            <select name="bankName" value={formData.bankName} onChange={handleChange}
              className="w-full ps-10 pe-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={inputStyle}>
              <option value="">-- {t('check.selectBank')} --</option>
              {banks.map((bank) => (
                <option key={bank.ar} value={bank.ar}>{bankLabel(bank)}</option>
              ))}
            </select>
          ),
        })}
        {renderField({ label: t('check.branchName'), name: 'branchName', icon: Building2, autoComplete: 'chrome-off' })}
      </div>

      {/* Row 6: Security PIN + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField({
          label: t('check.securityPin'), name: 'securityPin', icon: Lock, required: true,
          children: (
            <>
              <input
                type="tel"
                name="securityPin"
                value={formData.securityPin}
                onChange={handlePinChange}
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="****"
                autoComplete="one-time-code"
                className="w-full ps-10 pe-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                style={{ ...inputStyle, ...(showPin ? {} : { WebkitTextSecurity: 'disc' }) }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute end-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </>
          ),
        })}
        {renderField({
          label: t('check.status'), name: 'status', icon: Hash, required: true,
          children: (
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full ps-10 pe-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={inputStyle}>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{t(`status.${opt.value}`)}</option>
              ))}
            </select>
          ),
        })}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#0F172A] text-white py-2.5 px-8 rounded-xl font-medium hover:bg-[#1E293B] transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save size={18} />
          {isLoading ? t('check.saving') : t('check.save')}
        </button>
      </div>
    </form>
  );
};

export default CheckForm;
