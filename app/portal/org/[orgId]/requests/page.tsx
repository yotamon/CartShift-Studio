import RequestsClient from './RequestsClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default-org' }];
}

export default function RequestsPage() {
  return <RequestsClient />;
}
