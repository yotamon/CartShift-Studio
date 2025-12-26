import FilesClient from './FilesClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function FilesPage() {
  return <FilesClient />;
}
