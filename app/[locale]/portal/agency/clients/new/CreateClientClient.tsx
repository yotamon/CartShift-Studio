'use client';

import { CreateOrganizationForm } from '@/components/portal/forms/CreateOrganizationForm';
import { useRouter } from '@/i18n/navigation';

export default function CreateClientClient() {
  const router = useRouter();

  return (
    <div className="h-full w-full flex items-center justify-center p-6">
       <CreateOrganizationForm
         onSuccess={(orgId) => router.push(`/portal/org/${orgId}/dashboard`)}
         onCancel={() => router.back()}
       />
    </div>
  );
}
