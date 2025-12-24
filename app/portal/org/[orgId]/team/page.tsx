import TeamClient from './TeamClient';

export async function generateStaticParams(): Promise<Array<{ orgId: string }>> {
  return [{ orgId: 'default' }];
}

export default function TeamPage() {
  return <TeamClient />;
}
