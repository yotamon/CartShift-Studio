import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { setupFirebaseMocks, mockUserData } from '../utils/mock-firebase';
import DashboardClient from '@/app/[locale]/portal/(workspace)/dashboard/DashboardClient';

vi.mock('@/lib/hooks/useResolvedOrgId', () => ({
  useResolvedOrgId: () => 'org-1',
}));

vi.mock('@/lib/services/portal-requests', () => ({
  subscribeToOrgRequests: vi.fn((_orgId, callback) => {
    callback([]);
    return vi.fn();
  }),
}));

vi.mock('@/lib/services/portal-activities', () => ({
  subscribeToOrgActivities: vi.fn((_orgId, callback) => {
    callback([]);
    return vi.fn();
  }),
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

describe('Dashboard Page', () => {
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

    render(<DashboardClient messages={{}} locale="en" />);
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard content when loaded', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
    });

    render(<DashboardClient messages={{}} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  it('shows error message when access is denied', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
    });

    const { getMemberByUserId, ensureMembership } = await import('@/lib/services/portal-organizations');
    vi.mocked(getMemberByUserId).mockResolvedValue(null);
    vi.mocked(ensureMembership).mockResolvedValue(null);

    render(<DashboardClient messages={{}} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText(/access restricted/i)).toBeInTheDocument();
    });
  });

  it('displays new request button', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
    });

    render(<DashboardClient messages={{}} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText(/new request/i)).toBeInTheDocument();
    });
  });
});
