import { useState, useEffect } from 'react';
import { Building2, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';

const BanksPage = () => {
  const { t, locale } = useLocale();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name_ar: '', name_en: '' });
  const [editForm, setEditForm] = useState({ name_ar: '', name_en: '' });

  const fetchBanks = async () => {
    const { data, error } = await supabase.from('banks').select('*').order('created_at');
    if (!error) setBanks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBanks(); }, []);

  const handleAdd = async () => {
    if (!form.name_ar.trim() || !form.name_en.trim()) return;
    setAdding(true);
    const { error } = await supabase.from('banks').insert(form);
    if (!error) {
      setForm({ name_ar: '', name_en: '' });
      fetchBanks();
    } else {
      alert(t('common.error') + ': ' + error.message);
    }
    setAdding(false);
  };

  const handleEdit = async (id) => {
    if (!editForm.name_ar.trim() || !editForm.name_en.trim()) return;
    const { error } = await supabase.from('banks').update(editForm).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchBanks();
    } else {
      alert(t('common.error') + ': ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('banks.deleteConfirm'))) return;
    const { error } = await supabase.from('banks').delete().eq('id', id);
    if (!error) fetchBanks();
    else alert(t('common.error') + ': ' + error.message);
  };

  const startEdit = (bank) => {
    setEditingId(bank.id);
    setEditForm({ name_ar: bank.name_ar, name_en: bank.name_en });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--text)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('banks.title')}</h1>
      </div>

      {/* Add form */}
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm border mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('banks.nameAr')}</label>
            <input
              value={form.name_ar}
              onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
              placeholder="بنك..."
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              dir="rtl"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('banks.nameEn')}</label>
            <input
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              placeholder="Bank..."
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              dir="ltr"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={adding || !form.name_ar.trim() || !form.name_en.trim()}
              className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-50 cursor-pointer text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {adding ? t('banks.adding') : t('banks.add')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {banks.length === 0 ? (
        <div className="rounded-2xl p-12 shadow-sm border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('banks.noData')}</p>
        </div>
      ) : (
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>#</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('banks.nameAr')}</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('banks.nameEn')}</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank, i) => (
                  <tr key={bank.id} className="border-b last:border-b-0 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-4" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    {editingId === bank.id ? (
                      <>
                        <td className="py-2 px-4">
                          <input value={editForm.name_ar} onChange={(e) => setEditForm({ ...editForm, name_ar: e.target.value })}
                            className="w-full px-2 py-1.5 border rounded-lg text-sm" dir="rtl"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                        </td>
                        <td className="py-2 px-4">
                          <input value={editForm.name_en} onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                            className="w-full px-2 py-1.5 border rounded-lg text-sm" dir="ltr"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEdit(bank.id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" style={{ color: 'var(--text-muted)' }}><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-medium" style={{ color: 'var(--text)' }}>{bank.name_ar}</td>
                        <td className="py-3 px-4" style={{ color: 'var(--text)' }}>{bank.name_en}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit(bank)} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75 cursor-pointer" style={{ color: 'var(--text)' }}>
                              <Pencil className="w-3.5 h-3.5" /> {t('banks.edit')}
                            </button>
                            <button onClick={() => handleDelete(bank.id)} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" /> {t('banks.delete')}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanksPage;
