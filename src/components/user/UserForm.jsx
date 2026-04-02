import { useState, useEffect } from 'react';
import { useLocale } from '../../context/LocaleContext';

const UserForm = ({ initialData, onSubmit, isLoading, isEdit = false }) => {
  const { t } = useLocale();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        password: '',
        role: initialData.role || 'user',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = t('users.nameRequired');
    if (!isEdit) {
      if (!form.email.trim()) {
        newErrors.email = t('users.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = t('users.emailInvalid');
      }
    }
    if (!isEdit && !form.password) newErrors.password = t('users.passwordRequired');
    if (form.password && form.password.length < 6) newErrors.password = t('users.passwordMin');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all";
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="rounded-2xl p-4 sm:p-6 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text)' }}>{t('users.fullName')} *</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={inputClass}
            style={{ backgroundColor: 'var(--bg)', borderColor: errors.fullName ? '#DC2626' : 'var(--border)', color: 'var(--text)' }}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text)' }}>{t('users.email')} {!isEdit && '*'}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isEdit}
            autoComplete="off"
            className={`${inputClass} ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: 'var(--bg)', borderColor: errors.email ? '#DC2626' : 'var(--border)', color: 'var(--text)' }}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text)' }}>
            {isEdit ? t('users.resetPassword') : t('users.password')} {!isEdit && '*'}
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={isEdit ? t('users.resetPasswordPlaceholder') : t('users.passwordPlaceholder')}
            autoComplete="new-password"
            className={inputClass}
            style={{ backgroundColor: 'var(--bg)', borderColor: errors.password ? '#DC2626' : 'var(--border)', color: 'var(--text)' }}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Role */}
        <div>
          <label className={labelClass} style={{ color: 'var(--text)' }}>{t('users.role')}</label>
          <select
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className={inputClass}
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <option value="user">{t('users.user')}</option>
            <option value="admin">{t('users.admin')}</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading
            ? (isEdit ? t('users.saving') : t('users.creating'))
            : (isEdit ? t('users.save') : t('users.addUser'))
          }
        </button>
      </div>
    </form>
  );
};

export default UserForm;
