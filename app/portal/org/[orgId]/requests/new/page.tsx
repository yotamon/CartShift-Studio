import NewRequestClient from './NewRequestClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default' }];
}

export default function NewRequestPage() {
  return <NewRequestClient />;
}
