'use client';

import { CreateOrganizationForm } from '@/components/portal/forms/CreateOrganizationForm';
import { useRouter } from '@/i18n/navigation';

export default function CreateClientPage() {
  const router = useRouter();

  return (
    <div className="h-full w-full flex items-center justify-center p-6">
       {/*
         CreateOrganizationForm has fixed positioning by default (modal style).
         We can just render it here.
       */}
       <CreateOrganizationForm
         onSuccess={(orgId) => router.push(`/portal/org/${orgId}/dashboard`)}
         onCancel={() => router.back()}
       />
    </div>
  );
}
