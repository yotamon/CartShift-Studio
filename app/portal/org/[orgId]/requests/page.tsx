import RequestsClient from './RequestsClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default' }];
}

export default function RequestsPage() {
  return <RequestsClient />;
}
