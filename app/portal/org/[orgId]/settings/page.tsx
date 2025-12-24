import SettingsClient from './SettingsClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default' }];
}

export default function SettingsPage() {
  return <SettingsClient />;
}
