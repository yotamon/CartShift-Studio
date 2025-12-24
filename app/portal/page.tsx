import { redirect } from 'next/navigation';

export default function PortalRoot() {
  // Check auth and redirect accordingly
  // For now, redirect to login
  redirect('/portal/login/');
}
