import SettingsClient from './SettingsClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default-org' }];
}

export default function SettingsPage() {
  return <SettingsClient />;
}
