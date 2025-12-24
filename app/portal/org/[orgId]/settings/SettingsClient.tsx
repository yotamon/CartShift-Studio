'use client';

import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { User, Bell, Shield, CreditCard, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsClient() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--portal-text-primary)]">Settings</h1>
        <p className="text-[var(--portal-text-secondary)] mt-1">Manage your account and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {[
              { label: 'General', icon: User, active: true },
              { label: 'Notifications', icon: Bell },
              { label: 'Security', icon: Shield },
              { label: 'Billing', icon: CreditCard },
            ].map(item => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.active
                    ? "bg-slate-100 dark:bg-slate-800 text-[var(--portal-accent)]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <PortalCard>
            <h3 className="text-lg font-bold text-[var(--portal-text-primary)] mb-6">Organization Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <PortalInput label="Organization Name" defaultValue="CartShift Studio" />
               <PortalInput label="Industry" defaultValue="Marketing Agency" />
               <div className="md:col-span-2">
                 <PortalInput label="Website URL" defaultValue="https://cartshift-studio.com" />
               </div>
               <div className="md:col-span-2">
                  <label className="text-sm font-medium text-[var(--portal-text-secondary)] block mb-1.5">Business Bio</label>
                  <textarea
                    className="portal-input min-h-[100px] py-2"
                    defaultValue="A creative agency focused on high-performance e-commerce solutions."
                  />
               </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--portal-border)] flex justify-end">
               <PortalButton className="flex items-center gap-2">
                 <Save size={18} /> Save Changes
               </PortalButton>
            </div>
          </PortalCard>

          <PortalCard className="border-red-100 dark:border-red-900/20">
             <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
             <p className="text-sm text-slate-500 mb-6 font-medium">
               Once you delete your organization, there is no going back. Please be certain.
             </p>
             <PortalButton variant="danger" size="sm">
               Delete Organization
             </PortalButton>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

