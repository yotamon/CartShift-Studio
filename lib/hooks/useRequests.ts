import { RequestStatus } from '@/lib/schemas/portal';

interface Request {
  id: string;
  orgId: string;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt?: { toDate: () => Date };
}

export function useRequests(_orgId?: string) {
  return {
    requests: [] as Request[],
    loading: false,
    error: null as string | null,
  };
}

