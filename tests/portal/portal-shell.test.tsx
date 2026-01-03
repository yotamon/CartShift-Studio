import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { setupFirebaseMocks, mockUserData } from '../utils/mock-firebase';
import { PortalShell } from '@/components/portal/PortalShell';

const mockPush = vi.fn();
const mockPathname = '/portal/org/org-1/dashboard';

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => mockPathname,
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/lib/services/portal-notifications', () => ({
  subscribeToNotifications: vi.fn(() => vi.fn()),
  subscribeToUnreadCount: vi.fn(() => vi.fn()),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
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

describe('Portal Shell', () => {
  beforeEach(() => {
    setupFirebaseMocks();
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  it('shows loading state initially', () => {
    mockUsePortalAuth.mockReturnValue({
      userData: null,
      loading: true,
      isAuthenticated: false,
      accountType: 'CLIENT',
    });

    render(
      <PortalShell orgId="org-1">
        <div>Test Content</div>
      </PortalShell>
    );
    expect(screen.getByText(/initializing/i)).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: null,
      loading: false,
      isAuthenticated: false,
      accountType: 'CLIENT',
    });

    render(
      <PortalShell orgId="org-1">
        <div>Test Content</div>
      </PortalShell>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/portal/login/');
    }, { timeout: 3000 });
  });

  it('renders content when authenticated and authorized', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
      accountType: 'CLIENT',
    });

    render(
      <PortalShell orgId="org-1">
        <div>Test Content</div>
      </PortalShell>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays navigation sidebar', async () => {
    mockUsePortalAuth.mockReturnValue({
      userData: mockUserData(),
      loading: false,
      isAuthenticated: true,
      accountType: 'CLIENT',
    });

    render(
      <PortalShell orgId="org-1">
        <div>Test Content</div>
      </PortalShell>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
