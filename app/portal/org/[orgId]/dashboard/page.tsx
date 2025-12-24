import DashboardClient from './DashboardClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default' }];
}

export default function DashboardPage() {
  return <DashboardClient />;
}
