import { useState, useEffect } from 'react';
import { Hash, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLocale } from '../context/LocaleContext';

const COLOR_OPTIONS = ['amber', 'emerald', 'red', 'blue', 'purple', 'orange', 'cyan', 'pink'];

const ColorDot = ({ color }) => {
  const colorMap = {
    amber: 'bg-amber-400', emerald: 'bg-emerald-400', red: 'bg-red-400',
    blue: 'bg-blue-400', purple: 'bg-purple-400', orange: 'bg-orange-400',
    cyan: 'bg-cyan-400', pink: 'bg-pink-400',
  };
  return <span className={`inline-block w-4 h-4 rounded-full ${colorMap[color] || 'bg-gray-400'}`} />;
};

const StatusesPage = () => {
  const { t, locale } = useLocale();
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ value: '', label_ar: '', label_en: '', color: 'amber' });
  const [editForm, setEditForm] = useState({ value: '', label_ar: '', label_en: '', color: 'amber' });

  const fetchStatuses = async () => {
    const { data, error } = await supabase.from('statuses').select('*').order('created_at');
    if (!error) setStatuses(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchStatuses(); }, []);

  const handleAdd = async () => {
    if (!form.value.trim() || !form.label_ar.trim() || !form.label_en.trim()) return;
    setAdding(true);
    const { error } = await supabase.from('statuses').insert(form);
    if (!error) {
      setForm({ value: '', label_ar: '', label_en: '', color: 'amber' });
      fetchStatuses();
    } else {
      alert(t('common.error') + ': ' + error.message);
    }
    setAdding(false);
  };

  const handleEdit = async (id) => {
    if (!editForm.label_ar.trim() || !editForm.label_en.trim()) return;
    const { error } = await supabase.from('statuses').update({
      label_ar: editForm.label_ar,
      label_en: editForm.label_en,
      color: editForm.color,
    }).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchStatuses();
    } else {
      alert(t('common.error') + ': ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('statuses.deleteConfirm'))) return;
    const { error } = await supabase.from('statuses').delete().eq('id', id);
    if (!error) fetchStatuses();
    else alert(t('common.error') + ': ' + error.message);
  };

  const startEdit = (status) => {
    setEditingId(status.id);
    setEditForm({ value: status.value, label_ar: status.label_ar, label_en: status.label_en, color: status.color });
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
        <Hash className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: 'var(--text)' }} />
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{t('statuses.title')}</h1>
      </div>

      {/* Add form */}
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm border mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('statuses.value')}</label>
            <input
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value.toLowerCase().replace(/\s/g, '_') })}
              placeholder="e.g. pending"
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('statuses.labelAr')}</label>
            <input
              value={form.label_ar}
              onChange={(e) => setForm({ ...form, label_ar: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('statuses.labelEn')}</label>
            <input
              value={form.label_en}
              onChange={(e) => setForm({ ...form, label_en: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('statuses.color')}</label>
            <select
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={adding || !form.value.trim() || !form.label_ar.trim() || !form.label_en.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-50 cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" />
              {adding ? t('statuses.adding') : t('statuses.add')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {statuses.length === 0 ? (
        <div className="rounded-2xl p-12 shadow-sm border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('statuses.noData')}</p>
        </div>
      ) : (
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('statuses.value')}</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('statuses.labelAr')}</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('statuses.labelEn')}</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('statuses.color')}</th>
                  <th className="text-start py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{t('check.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((status) => (
                  <tr key={status.id} className="border-b last:border-b-0 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    {editingId === status.id ? (
                      <>
                        <td className="py-2 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{status.value}</td>
                        <td className="py-2 px-4">
                          <input value={editForm.label_ar} onChange={(e) => setEditForm({ ...editForm, label_ar: e.target.value })}
                            className="w-full px-2 py-1.5 border rounded-lg text-sm" dir="rtl"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                        </td>
                        <td className="py-2 px-4">
                          <input value={editForm.label_en} onChange={(e) => setEditForm({ ...editForm, label_en: e.target.value })}
                            className="w-full px-2 py-1.5 border rounded-lg text-sm" dir="ltr"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                        </td>
                        <td className="py-2 px-4">
                          <select value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                            className="px-2 py-1.5 border rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                            {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEdit(status.id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" style={{ color: 'var(--text-muted)' }}><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{status.value}</td>
                        <td className="py-3 px-4 font-medium" style={{ color: 'var(--text)' }}>{status.label_ar}</td>
                        <td className="py-3 px-4" style={{ color: 'var(--text)' }}>{status.label_en}</td>
                        <td className="py-3 px-4"><div className="flex items-center gap-2"><ColorDot color={status.color} /><span className="text-xs" style={{ color: 'var(--text-muted)' }}>{status.color}</span></div></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit(status)} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors hover:opacity-75 cursor-pointer" style={{ color: 'var(--text)' }}>
                              <Pencil className="w-3.5 h-3.5" /> {t('statuses.edit')}
                            </button>
                            <button onClick={() => handleDelete(status.id)} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" /> {t('statuses.delete')}
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

export default StatusesPage;
