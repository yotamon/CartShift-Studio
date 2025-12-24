import RequestDetailClient from './RequestDetailClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string; requestId: string }>> {
  return [{ orgId: 'default-org', requestId: 'default' }];
}

export default function RequestDetailPage() {
  return <RequestDetailClient />;
}
