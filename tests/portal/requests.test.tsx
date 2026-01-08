import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { setupFirebaseMocks, mockUserData } from '../utils/mock-firebase';
import RequestsClient from '@/app/[locale]/portal/(workspace)/requests/RequestsClient';

vi.mock('@/lib/hooks/useResolvedOrgId', () => ({
  useResolvedOrgId: () => 'org-1',
}));

vi.mock('@/lib/services/portal-requests', () => ({
  subscribeToOrgRequests: vi.fn((_orgId, callback) => {
    callback([
      {
        id: 'req-1',
        orgId: 'org-1',
        title: 'Test Request',
        status: 'PENDING',
        createdAt: { toDate: () => new Date() },
      },
    ]);
    return vi.fn();
  }),
  deleteRequest: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/services/portal-organizations', () => ({
  getMemberByUserId: vi.fn().mockResolvedValue({
    id: 'member-1',
    userId: 'test-user-id',
    role: 'OWNER',
  }),
  ensureMembership: vi.fn().mockResolvedValue({
    id: 'member-1',
    userId: 'test-user-id',
    role: 'OWNER',
  }),
}));

const mockUsePortalAuth = vi.fn();

vi.mock('@/lib/hooks/usePortalAuth', () => ({
  usePortalAuth: () => mockUsePortalAuth(),
}));

describe('Requests Page', () => {
  beforeEach(() => {
    setupFirebaseMocks();
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: true,
      isAuthenticated: true,
    });

    render(<RequestsClient />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders requests list when loaded', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
    });

    render(<RequestsClient />);

    await waitFor(() => {
      expect(screen.getByText(/test request/i)).toBeInTheDocument();
    });
  });

  it('displays new request button', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
    });

    render(<RequestsClient />);

    await waitFor(() => {
      expect(screen.getByText(/new request/i)).toBeInTheDocument();
    });
  });
});
