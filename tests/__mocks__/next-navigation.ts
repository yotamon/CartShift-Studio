import { vi } from 'vitest';

export function useRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
}

export function usePathname() {
  return '/portal/dashboard';
}

export function useSearchParams() {
  return {
    get: vi.fn(() => null),
    toString: vi.fn(() => ''),
  };
}
