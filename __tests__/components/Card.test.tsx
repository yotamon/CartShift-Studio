import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import '@testing-library/jest-dom';

describe('Card', () => {
  it('renders card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies hover effect when hover prop is true', () => {
    const { container } = render(<Card hover>Hover Card</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:scale-[1.02]', 'hover:-translate-y-1');
  });

  it('applies glow effect when glow prop is true', () => {
    const { container } = render(<Card glow="glow">Glow Card</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('liquid-glass-glow');
  });

  it('applies accent styles when accent prop is true', () => {
    const { container } = render(<Card accent>Accent Card</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('border-accent-500/30');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('renders CardHeader component', () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders CardTitle component', () => {
    render(
      <Card>
        <CardTitle>Title content</CardTitle>
      </Card>
    );
    expect(screen.getByText('Title content')).toBeInTheDocument();
  });

  it('renders CardContent component', () => {
    render(
      <Card>
        <CardContent>Content text</CardContent>
      </Card>
    );
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('renders full card composition', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Test content</CardContent>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
