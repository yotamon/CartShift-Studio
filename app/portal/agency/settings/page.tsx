'use client';

import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { User, Shield, CreditCard, Save, Settings2, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgencySettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--portal-text-primary)]">Agency Settings</h1>
        <p className="text-[var(--portal-text-secondary)] mt-1">Manage global agency configurations and team defaults.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {[
              { label: 'Agency Profile', icon: Building2, active: true },
              { label: 'Service Packages', icon: Settings2 },
              { label: 'Internal Team', icon: User },
              { label: 'Integrations', icon: Shield },
              { label: 'Payouts', icon: CreditCard },
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
                {item.icon && <item.icon size={18} />}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <PortalCard>
            <h3 className="text-lg font-bold text-[var(--portal-text-primary)] mb-6">Agency Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <PortalInput label="Agency Name" defaultValue="CartShift Studio" />
               <PortalInput label="Support Email" defaultValue="support@cartshift-studio.com" />
               <div className="md:col-span-2">
                 <PortalInput label="Agency Website" defaultValue="https://cartshift-studio.com" />
               </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--portal-border)] flex justify-end">
               <PortalButton className="flex items-center gap-2">
                 <Save size={18} /> Save Changes
               </PortalButton>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
