import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { useLocale } from '../context/LocaleContext';
import UserForm from '../components/user/UserForm';

const AddUserPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      // Use admin.createUser() — bypasses email confirmation and rate limits
      const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.fullName,
        },
      });
      if (createError) throw createError;

      if (data?.user?.id) {
        const { error: upsertError } = await supabaseAdmin.from('profiles').upsert({
          id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          role: formData.role,
        }, { onConflict: 'id' });
        if (upsertError) throw upsertError;
      }

      navigate('/users');
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('users.addNew')}</h1>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      <UserForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default AddUserPage;
