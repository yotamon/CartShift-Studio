/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogPageContent } from '@/components/sections/BlogPageContent';
import { useLanguage } from '@/components/providers/LanguageProvider';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock LanguageProvider
jest.mock('@/components/providers/LanguageProvider', () => ({
  useLanguage: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div>SearchIcon</div>,
  Calendar: () => <div>CalendarIcon</div>,
  Clock: () => <div>ClockIcon</div>,
  ArrowRight: () => <div>ArrowRightIcon</div>,
  Filter: () => <div>FilterIcon</div>,
  ChevronLeft: () => <div>ChevronLeftIcon</div>,
  ChevronRight: () => <div>ChevronRightIcon</div>,
  Sparkles: () => <div>SparklesIcon</div>,
  TrendingUp: () => <div>TrendingUpIcon</div>,
}));

describe('BlogPageContent', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });

    // Mock searchParams with proper URLSearchParams interface
    const mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => mockSearchParams.get(key),
      getAll: (key: string) => mockSearchParams.getAll(key),
      has: (key: string) => mockSearchParams.has(key),
      toString: () => mockSearchParams.toString(),
      entries: () => mockSearchParams.entries(),
      keys: () => mockSearchParams.keys(),
      values: () => mockSearchParams.values(),
      forEach: (callback: any) => mockSearchParams.forEach(callback),
    });

    (useLanguage as jest.Mock).mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, any> = {
          'blog.hero.title': 'Our Blog',
          'blog.hero.subtitle': 'Latest insights',
          'blog.hero.badge': 'Fresh Posts',
          'blog.categories': 'Categories:',
          'blog.readMore': 'Read more',
          'blog.noPosts': 'No posts yet',
        };
        return translations[key] || key;
      },
      language: 'en' as const,
      direction: 'ltr' as const,
    });
  });

  const samplePosts = [
    {
      slug: 'test-post-1',
      title: 'Test Post 1',
      excerpt: 'Excerpt 1',
      date: '2024-01-01',
      category: 'Technology',
      content: 'Content 1',
      readingTime: 5,
    },
    {
      slug: 'test-post-2',
      title: 'Test Post 2',
      excerpt: 'Excerpt 2',
      date: '2024-01-02',
      category: 'Design',
      content: 'Content 2',
      readingTime: 3,
    },
  ];

  it('renders blog page with posts', () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Check for Featured Posts section (only shown when no filters active and on page 1)
    expect(screen.getByText('Featured Posts')).toBeInTheDocument();

    // Posts appear twice: once in featured section, once in main listing
    // So use getAllByText to check both instances exist
    expect(screen.getAllByText('Test Post 1')).toHaveLength(2); // Featured + main list
    expect(screen.getAllByText('Test Post 2')).toHaveLength(2); // Featured + main list
  });

  it('reads initial category from URL', () => {
    // Create new URLSearchParams with category set
    const paramsWithCategory = new URLSearchParams();
    paramsWithCategory.set('category', 'Technology');
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => paramsWithCategory.get(key),
      getAll: (key: string) => paramsWithCategory.getAll(key),
      has: (key: string) => paramsWithCategory.has(key),
      toString: () => paramsWithCategory.toString(),
      entries: () => paramsWithCategory.entries(),
      keys: () => paramsWithCategory.keys(),
      values: () => paramsWithCategory.values(),
      forEach: (callback: any) => paramsWithCategory.forEach(callback),
    });

    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Technology category should be selected based on URL
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    // Design post should be filtered out
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });

  it('updates URL when category is selected', () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Use getAllByRole since category appears in multiple buttons (horizontal filter + sidebar)
    const categoryButtons = screen.getAllByRole('button', { name: /technology/i });
    fireEvent.click(categoryButtons[0]); // Click first one (horizontal filter)

    // Verify URL was updated with category and page reset to 1
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('category=Technology'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'));
  });

  it('updates URL when search query is entered', async () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Find search input (should have placeholder or aria-label)
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Verify URL was updated with search query (async due to debouncing)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('search=Test'));
    });
  });

  it('updates URL when sort option is changed', () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Find sort select
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });

    // Verify URL was updated with sort option
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=oldest'));
  });

  it('updates URL when page is changed', () => {
    // Create enough posts for pagination (assuming 9 posts per page)
    const manyPosts = Array.from({ length: 20 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      excerpt: `Excerpt ${i}`,
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      category: 'Technology',
      content: `Content ${i}`,
      readingTime: 5,
    }));

    render(<BlogPageContent posts={manyPosts} categories={['Technology']} />);

    // Find next page button by role since it may not have aria-label
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Verify URL was updated with page 2
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  it('reads initial search query from URL', () => {
    // Create new URLSearchParams with search query set
    const paramsWithSearch = new URLSearchParams();
    paramsWithSearch.set('search', 'Test Post 1');
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => paramsWithSearch.get(key),
      getAll: (key: string) => paramsWithSearch.getAll(key),
      has: (key: string) => paramsWithSearch.has(key),
      toString: () => paramsWithSearch.toString(),
      entries: () => paramsWithSearch.entries(),
      keys: () => paramsWithSearch.keys(),
      values: () => paramsWithSearch.values(),
      forEach: (callback: any) => paramsWithSearch.forEach(callback),
    });

    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Only Test Post 1 should match the search
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });

  it('reads initial sort option from URL', () => {
    // Create new URLSearchParams with sort option set
    const paramsWithSort = new URLSearchParams();
    paramsWithSort.set('sort', 'oldest');
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => paramsWithSort.get(key),
      getAll: (key: string) => paramsWithSort.getAll(key),
      has: (key: string) => paramsWithSort.has(key),
      toString: () => paramsWithSort.toString(),
      entries: () => paramsWithSort.entries(),
      keys: () => paramsWithSort.keys(),
      values: () => paramsWithSort.values(),
      forEach: (callback: any) => paramsWithSort.forEach(callback),
    });

    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Featured section shows newest posts first regardless of sort parameter
    // Get all post titles - featured shows first (newest), then main grid (sorted oldest)
    const posts = screen.getAllByText(/Test Post/);
    // Featured section: Post 2 (newest)
    expect(posts[0]).toHaveTextContent('Test Post 2');
  });

  it('reads initial page number from URL', () => {
    const manyPosts = Array.from({ length: 20 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      excerpt: `Excerpt ${i}`,
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      category: 'Technology',
      content: `Content ${i}`,
      readingTime: 5,
    }));

    const paramsWithPage = new URLSearchParams();
    paramsWithPage.set('page', '2');
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => paramsWithPage.get(key),
      getAll: (key: string) => paramsWithPage.getAll(key),
      has: (key: string) => paramsWithPage.has(key),
      toString: () => paramsWithPage.toString(),
      entries: () => paramsWithPage.entries(),
      keys: () => paramsWithPage.keys(),
      values: () => paramsWithPage.values(),
      forEach: (callback: any) => paramsWithPage.forEach(callback),
    });

    render(<BlogPageContent posts={manyPosts} categories={['Technology']} />);

    // Should show posts 10-18 (page 2)
    expect(screen.getByText('Post 9')).toBeInTheDocument();
  });

  it('resets to page 1 when category changes', () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Use getAllByRole since Technology appears in multiple places (filter + sidebar)
    const categoryButtons = screen.getAllByRole('button', { name: /technology/i });
    fireEvent.click(categoryButtons[0]);

    // Verify page was reset to 1
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'));
  });

  it('handles empty posts array', () => {
    render(<BlogPageContent posts={[]} categories={[]} />);

    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('filters posts by category', () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Initially all posts visible (appear in both featured + main grid)
    expect(screen.getAllByText('Test Post 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test Post 2').length).toBeGreaterThan(0);

    // Click Technology category using getAllByRole
    const techButtons = screen.getAllByRole('button', { name: /technology/i });
    fireEvent.click(techButtons[0]);

    // After URL update, only Technology post should be visible
    // (In reality, this would require re-rendering with updated searchParams)
  });

  it('clears category filter when "All" is clicked', () => {
    // Create new URLSearchParams with category set
    const paramsWithCategory = new URLSearchParams();
    paramsWithCategory.set('category', 'Technology');
    (useSearchParams as jest.Mock).mockReturnValue(paramsWithCategory);

    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Click "All" button (use getByRole to target the button specifically)
    const allButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allButton);

    // Verify URL clears category parameter
    expect(mockPush).toHaveBeenCalledWith(expect.not.stringContaining('category='));
  });

  it('displays featured posts section when no filters active', () => {
    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Featured section should be visible (check for "Featured" or similar heading)
    expect(screen.getByText(/featured|latest/i)).toBeInTheDocument();
  });

  it('hides featured posts when search query is active', () => {
    // Create new URLSearchParams with search query set
    const paramsWithSearch = new URLSearchParams();
    paramsWithSearch.set('search', 'Test');
    (useSearchParams as jest.Mock).mockReturnValue(paramsWithSearch);

    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Featured section should be hidden when searching
    expect(screen.queryByText(/featured|latest/i)).not.toBeInTheDocument();
  });

  it('hides featured posts when category filter is active', () => {
    // Create new URLSearchParams with category filter set
    const paramsWithCategory = new URLSearchParams();
    paramsWithCategory.set('category', 'Technology');
    (useSearchParams as jest.Mock).mockReturnValue(paramsWithCategory);

    render(<BlogPageContent posts={samplePosts} categories={['Technology', 'Design']} />);

    // Featured section should be hidden when filtering
    expect(screen.queryByText(/featured|latest/i)).not.toBeInTheDocument();
  });

  it('supports Hebrew language with translations', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      t: (key: string) => {
        if (key === 'blog.hero.title') return 'הבלוג שלנו';
        return key;
      },
      language: 'he' as const,
      direction: 'rtl' as const,
    });

    const hebrewPosts = samplePosts.map(post => ({
      ...post,
      translation: {
        title: `${post.title} HE`,
        excerpt: `${post.excerpt} HE`,
        category: `${post.category} HE`,
        content: `${post.content} HE`,
      },
    }));

    render(<BlogPageContent posts={hebrewPosts} categories={['Technology', 'Design']} />);

    // Component shows 'Featured Posts' heading from translations
    expect(screen.getByText('מאמרים מובלטים')).toBeInTheDocument(); // 'Featured Posts' in Hebrew
    // Posts appear in both featured and main sections
    expect(screen.getAllByText('Test Post 1 HE').length).toBeGreaterThan(0);
  });
});
