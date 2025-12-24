import InviteClient from './InviteClient';

export async function generateStaticParams() {
  // Return a placeholder for static export - actual routing happens client-side
  return [{ code: 'template' }];
}


export default function InvitePage() {
  return <InviteClient />;
}


