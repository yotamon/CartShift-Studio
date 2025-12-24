import { redirect } from 'next/navigation';

export default function PortalOrgRoot() {
  // In a real app, we'd fetch the user's default orgId
  // For now, redirect to a placeholder orgId
  redirect('/portal/org/default-org/dashboard/');
}
