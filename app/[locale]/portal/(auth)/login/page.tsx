import LoginClient from './LoginClient';

export async function generateStaticParams() {
  // Return empty array - the parent layout already handles the [locale] param
  // This page has no dynamic segments of its own
  return [];
}

export default function LoginPage() {
  return <LoginClient />;
}
