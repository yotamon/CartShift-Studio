'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { Service, Currency, CURRENCY_CONFIG } from '@/lib/types/portal';
import { createService, updateService } from '@/lib/services/portal-services';
import { X, Save, AlertCircle } from 'lucide-react';

interface ManageServiceFormProps {
  service?: Service; // If provided, we are editing
  onSuccess: () => void;
  onCancel: () => void;
}

export function ManageServiceForm({ service, onSuccess, onCancel }: ManageServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('portal.agency.settings.services.form');

  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    basePrice: service?.basePrice ? (service.basePrice / 100).toString() : '',
    currency: service?.currency || 'USD' as Currency,
    category: service?.category || '',
    isActive: service?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.basePrice) {
      setError(t('errors.required'));
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        basePrice: Math.round(parseFloat(formData.basePrice) * 100),
        currency: formData.currency,
        category: formData.category,
        isActive: formData.isActive,
      };

      if (service?.id) {
        await updateService(service.id, serviceData);
      } else {
        await createService(serviceData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err.message || t('errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
        <PortalCard className="relative p-8 shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <button
            onClick={onCancel}
            className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-outfit"
          >
            <X size={20} />
          </button>

          <header className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
              {service ? t('editTitle') : t('addTitle')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium font-outfit">
              {service ? t('editSubtitle') : t('addSubtitle')}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold font-outfit">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <PortalInput
              label={t('fields.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('fields.namePlaceholder')}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <PortalInput
                label={t('fields.basePrice')}
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="0.00"
                required
              />
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 font-outfit">
                  {t('fields.currency')}
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white text-sm font-bold font-outfit"
                >
                  {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                    <option key={code} value={code}>
                      {code} ({config.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <PortalInput
              label={t('fields.category')}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t('fields.categoryPlaceholder')}
            />

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 font-outfit">
                {t('fields.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-900 dark:text-white text-sm font-medium leading-relaxed font-outfit"
                placeholder={t('fields.descriptionPlaceholder')}
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-slate-700 dark:text-slate-300 font-outfit cursor-pointer">
                {t('fields.active')}
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <PortalButton
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 font-outfit"
              >
                {t('actions.cancel')}
              </PortalButton>
              <PortalButton
                type="submit"
                isLoading={loading}
                className="flex-1 font-outfit shadow-xl shadow-blue-500/20"
              >
                <Save size={18} className="mr-2" />
                {service ? t('actions.update') : t('actions.create')}
              </PortalButton>
            </div>
          </form>
        </PortalCard>
      </div>
    </div>
  );
}
