import { redirect } from 'next/navigation';

// Root page redirects to the default locale
// This is required for static export since middleware is not available
export default function RootPage() {
  redirect('/en');
}
