import TeamClient from './TeamClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default-org' }];
}

export default function TeamPage() {
  return <TeamClient />;
}
