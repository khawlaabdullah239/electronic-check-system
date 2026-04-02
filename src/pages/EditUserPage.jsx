import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { useLocale } from '../context/LocaleContext';
import UserForm from '../components/user/UserForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (!data) {
          setNotFound(true);
          return;
        }
        setInitialData({
          fullName: data.full_name || '',
          email: data.email || '',
          role: data.role || 'user',
        });
      } catch (err) {
        console.error('Error fetching user:', err.message);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      // Update profile in profiles table
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: formData.fullName,
          role: formData.role,
        })
        .eq('id', id);
      if (profileError) throw profileError;

      // If password was provided, update it via admin API
      if (formData.password) {
        const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(id, {
          password: formData.password,
        });
        if (pwError) throw pwError;
      }

      navigate('/users');
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{t('users.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Pencil className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('users.editUser')}</h1>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      <UserForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} isEdit />
    </div>
  );
};

export default EditUserPage;
