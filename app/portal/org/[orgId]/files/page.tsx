import FilesClient from './FilesClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default-org' }];
}

export default function FilesPage() {
  return <FilesClient />;
}
