'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function DraggableCard({ id, children, className, disabled = false }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  // Use CSS.Translate instead of CSS.Transform to avoid scale/skew offset issues
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-manipulation [&_*]:!cursor-inherit',
        isDragging && 'opacity-50',
        className
      )}
      {...attributes}
      {...(disabled ? {} : listeners)}
    >
      {children}
    </div>
  );
}
