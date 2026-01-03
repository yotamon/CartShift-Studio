'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "@/lib/motion";

const dropdownMenuVariants = cva(
  "fixed z-[9999] min-w-[200px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden",
  {
    variants: {
      align: {
        left: "",
        right: "",
      }
    },
    defaultVariants: {
      align: "right",
    }
  }
);

const dropdownItemVariants = cva(
  "w-full px-4 py-2.5 text-sm font-medium text-start flex items-center gap-3 transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
        danger: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      isDisabled: false,
    }
  }
);

export interface DropdownItem extends VariantProps<typeof dropdownItemVariants> {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps extends VariantProps<typeof dropdownMenuVariants> {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function Dropdown({ trigger, items, align = 'right', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [position, setPosition] = useState({ top: 0, left: 0, transform: '', transformOrigin: '', maxWidth: 300, maxHeight: 400 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      updateCoords();
      const viewportWidth = window.innerWidth;
      const edgePadding = 12;
      const rect = triggerRef.current.getBoundingClientRect();
      const maxDropdownWidth = viewportWidth - (edgePadding * 2);

      let initialLeft = align === 'right' ? rect.left + rect.width : rect.left;
      let initialTransform = align === 'right' ? 'translateX(-100%)' : 'none';
      let initialTransformOrigin = align === 'right' ? 'top right' : 'top left';

      if (align === 'right') {
        const leftEdge = initialLeft - 200;
        if (leftEdge < edgePadding) {
          initialLeft = rect.left;
          initialTransform = 'none';
          initialTransformOrigin = 'top left';
        } else if (initialLeft > viewportWidth - edgePadding) {
          initialLeft = viewportWidth - edgePadding;
          initialTransform = 'translateX(-100%)';
          initialTransformOrigin = 'top right';
        }
      } else {
        const rightEdge = initialLeft + 200;
        if (rightEdge > viewportWidth - edgePadding) {
          initialLeft = Math.max(edgePadding, viewportWidth - 200 - edgePadding);
          initialTransform = 'none';
          initialTransformOrigin = 'top left';
        } else if (initialLeft < edgePadding) {
          initialLeft = edgePadding;
        }
      }

      setPosition({
        top: rect.top + rect.height + 8,
        left: initialLeft,
        transform: initialTransform,
        transformOrigin: initialTransformOrigin,
        maxWidth: maxDropdownWidth,
        maxHeight: Math.min(window.innerHeight - (edgePadding * 2), 400),
      });
    }
  }, [isOpen, align, updateCoords]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const calculatePosition = (useEstimated = false) => {
        requestAnimationFrame(() => {
          if (!triggerRef.current || !dropdownRef.current) return;

          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const edgePadding = 16;
          const spacing = 8;
          const estimatedItemHeight = 44;
          const estimatedDropdownHeight = items.length * estimatedItemHeight + 16;

          const dropdownWidth = useEstimated ? 200 : Math.max(200, dropdownRef.current.offsetWidth);
          const dropdownHeight = useEstimated ? estimatedDropdownHeight : dropdownRef.current.offsetHeight;

          const maxDropdownWidth = Math.max(200, viewportWidth - (edgePadding * 2));
          const actualDropdownWidth = Math.min(dropdownWidth, maxDropdownWidth);

          let calculatedLeft: number;
          let calculatedTop: number;
          let calculatedTransform = '';
          let calculatedTransformOrigin = 'top left';

          calculatedTop = coords.top + coords.height + spacing;

          if (align === 'right') {
            calculatedLeft = coords.left + coords.width;
            const leftEdgeWithTransform = calculatedLeft - actualDropdownWidth;

            if (leftEdgeWithTransform >= edgePadding) {
              calculatedTransform = 'translateX(-100%)';
              calculatedTransformOrigin = 'top right';
            } else {
              calculatedLeft = coords.left;
              calculatedTransform = '';
              calculatedTransformOrigin = 'top left';
            }
          } else {
            calculatedLeft = coords.left;
            const rightEdge = calculatedLeft + actualDropdownWidth;

            if (rightEdge <= viewportWidth - edgePadding) {
              calculatedTransform = '';
              calculatedTransformOrigin = 'top left';
            } else {
              const spaceOnRight = viewportWidth - coords.left - coords.width;
              if (spaceOnRight >= actualDropdownWidth + edgePadding) {
                calculatedLeft = coords.left + coords.width;
                calculatedTransform = '';
                calculatedTransformOrigin = 'top left';
              } else {
                calculatedLeft = edgePadding;
                calculatedTransform = '';
                calculatedTransformOrigin = 'top left';
              }
            }
          }

          const finalLeftEdge = calculatedTransform === 'translateX(-100%)'
            ? calculatedLeft - actualDropdownWidth
            : calculatedLeft;
          const finalRightEdge = calculatedTransform === 'translateX(-100%)'
            ? calculatedLeft
            : calculatedLeft + actualDropdownWidth;

          if (finalLeftEdge < edgePadding) {
            calculatedLeft = edgePadding;
            calculatedTransform = '';
            calculatedTransformOrigin = 'top left';
          }

          if (finalRightEdge > viewportWidth - edgePadding) {
            calculatedLeft = viewportWidth - edgePadding;
            calculatedTransform = 'translateX(-100%)';
            calculatedTransformOrigin = 'top right';
          }

          const bottomEdge = calculatedTop + dropdownHeight;
          if (bottomEdge > viewportHeight - edgePadding) {
            const spaceAbove = coords.top - edgePadding;
            const spaceBelow = viewportHeight - coords.top - coords.height - edgePadding;

            if (spaceAbove >= dropdownHeight && spaceAbove > spaceBelow) {
              calculatedTop = coords.top - dropdownHeight - spacing;
              calculatedTransformOrigin = calculatedTransformOrigin.replace('top', 'bottom');
            } else {
              calculatedTop = Math.max(edgePadding, viewportHeight - dropdownHeight - edgePadding);
            }
          }

          if (calculatedTop < edgePadding) {
            calculatedTop = edgePadding;
          }

          const finalLeftEdgeCheck = calculatedTransform === 'translateX(-100%)'
            ? calculatedLeft - actualDropdownWidth
            : calculatedLeft;
          const finalRightEdgeCheck = calculatedTransform === 'translateX(-100%)'
            ? calculatedLeft
            : calculatedLeft + actualDropdownWidth;

          if (finalLeftEdgeCheck < edgePadding || finalRightEdgeCheck > viewportWidth - edgePadding) {
            calculatedLeft = Math.max(edgePadding, Math.min(viewportWidth - actualDropdownWidth - edgePadding, calculatedLeft));
            calculatedTransform = '';
            calculatedTransformOrigin = 'top left';
          }

          setPosition({
            top: calculatedTop,
            left: calculatedLeft,
            transform: calculatedTransform,
            transformOrigin: calculatedTransformOrigin,
            maxWidth: maxDropdownWidth,
            maxHeight: Math.min(viewportHeight - (edgePadding * 2), 400),
          });
        });
      };

      calculatePosition(true);

      const timeoutId = setTimeout(() => {
        calculatePosition(false);
      }, 0);

      const resizeObserver = new ResizeObserver(() => {
        calculatePosition(false);
      });

      if (dropdownRef.current) {
        resizeObserver.observe(dropdownRef.current);
      }

      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
      };
    }
  }, [isOpen, coords, align, items.length]);

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleResize = () => {
        updateCoords();
      };
      const handleScroll = () => {
        updateCoords();
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, updateCoords]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const checkAndFixPosition = () => {
        requestAnimationFrame(() => {
          if (!dropdownRef.current) return;

          const rect = dropdownRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const edgePadding = 16;

          const actualLeft = rect.left;
          const actualRight = rect.right;
          const actualWidth = rect.width;

          if (actualLeft < edgePadding || actualRight > viewportWidth - edgePadding) {
            let newLeft: number;

            if (actualLeft < edgePadding) {
              newLeft = edgePadding;
            } else {
              newLeft = Math.max(edgePadding, viewportWidth - actualWidth - edgePadding);
            }

            setPosition(prev => ({
              ...prev,
              left: newLeft,
              transform: '',
              transformOrigin: 'top left',
            }));
          }
        });
      };

      const timeoutId1 = setTimeout(checkAndFixPosition, 50);
      const timeoutId2 = setTimeout(checkAndFixPosition, 150);

      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const dropdownMenu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(dropdownMenuVariants({ align }))}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: position.transform,
            transformOrigin: position.transformOrigin,
            zIndex: 9999,
            width: 'auto',
            maxWidth: `${position.maxWidth}px`,
            maxHeight: `${position.maxHeight}px`,
            boxSizing: 'border-box',
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <div className="py-2 overflow-y-auto" style={{ maxHeight: `${position.maxHeight - 16}px` }}>
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={cn(dropdownItemVariants({ variant: item.variant, isDisabled: item.disabled }))}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const isTriggerButton = React.isValidElement(trigger) && trigger.type === 'button';

  const triggerElement = isTriggerButton
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        ref: (node: HTMLButtonElement | null) => {
          triggerRef.current = node;
          const originalRef = (trigger as any).ref;
          if (typeof originalRef === 'function') {
            originalRef(node);
          } else if (originalRef) {
            originalRef.current = node;
          }
        },
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          if (trigger.props?.onClick) {
            trigger.props.onClick(e);
          }
        },
        'aria-haspopup': 'true',
        'aria-expanded': isOpen,
      })
    : (
        <button
          ref={triggerRef}
          type="button"
          onClick={e => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center justify-center"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {trigger}
        </button>
      );

  return (
    <div className={cn("relative inline-block", className)} style={{ overflow: 'visible' }}>
      {triggerElement}

      {mounted && typeof document !== 'undefined' && document.body
        ? createPortal(dropdownMenu, document.body)
        : null}
    </div>
  );
}
