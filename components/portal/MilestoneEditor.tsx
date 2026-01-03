'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from "@/lib/motion";
import { useLocale } from 'next-intl';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  X,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Milestone,
  MilestoneStatus,
  MILESTONE_STATUS,
  MILESTONE_STATUS_CONFIG
} from '@/lib/types/portal';
import { PortalButton } from './ui/PortalButton';
import { Timestamp } from 'firebase/firestore';

interface MilestoneEditorProps {
  milestones: Milestone[];
  onSave: (milestones: Milestone[]) => Promise<void>;
  onClose?: () => void;
  className?: string;
}

const generateMilestoneId = () => `milestone_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const MilestoneEditor: React.FC<MilestoneEditorProps> = ({
  milestones: initialMilestones,
  onSave,
  onClose,
  className,
}) => {
  const locale = useLocale();
  const isHe = locale === 'he';

  const [milestones, setMilestones] = useState<Milestone[]>(
    [...initialMilestones].sort((a, b) => a.order - b.order)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMilestone = () => {
    const now = Timestamp.now();
    const newMilestone: Milestone = {
      id: generateMilestoneId(),
      title: isHe ? 'שלב חדש' : 'New Milestone',
      status: MILESTONE_STATUS.PENDING,
      order: milestones.length,
      createdAt: now,
      updatedAt: now,
    };
    setMilestones([...milestones, newMilestone]);
    setEditingId(newMilestone.id);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(milestones.map(m =>
      m.id === id
        ? { ...m, ...updates, updatedAt: Timestamp.now() }
        : m
    ));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id).map((m, i) => ({ ...m, order: i })));
    if (editingId === id) setEditingId(null);
  };

  const moveMilestone = (id: string, direction: 'up' | 'down') => {
    const index = milestones.findIndex(m => m.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === milestones.length - 1)
    ) return;

    const newMilestones = [...milestones];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap orders
    const tempOrder = newMilestones[index].order;
    newMilestones[index].order = newMilestones[swapIndex].order;
    newMilestones[swapIndex].order = tempOrder;

    // Swap positions
    [newMilestones[index], newMilestones[swapIndex]] = [newMilestones[swapIndex], newMilestones[index]];

    setMilestones(newMilestones);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(milestones);
      onClose?.();
    } catch (err) {
      setError(isHe ? 'שגיאה בשמירה. נסו שוב.' : 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">
          {isHe ? 'עריכת שלבי פרויקט' : 'Edit Milestones'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-surface-500" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'p-4 rounded-xl border bg-white dark:bg-surface-800',
                editingId === milestone.id
                  ? 'border-accent-300 dark:border-accent-700'
                  : 'border-surface-200 dark:border-surface-700'
              )}
            >
              {editingId === milestone.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder={isHe ? 'שם השלב' : 'Milestone title'}
                    autoFocus
                  />
                  <textarea
                    value={milestone.description || ''}
                    onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                    placeholder={isHe ? 'תיאור (אופציונלי)' : 'Description (optional)'}
                    rows={2}
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={milestone.status}
                      onChange={(e) => updateMilestone(milestone.id, { status: e.target.value as MilestoneStatus })}
                      className="flex-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    >
                      {Object.entries(MILESTONE_STATUS_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>
                          {isHe ? config.labelHe : config.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium"
                    >
                      {isHe ? 'סגור' : 'Done'}
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveMilestone(milestone.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded disabled:opacity-30 transition-colors"
                    >
                      <GripVertical size={14} className="text-surface-400 rotate-90" />
                    </button>
                    <button
                      onClick={() => moveMilestone(milestone.id, 'down')}
                      disabled={index === milestones.length - 1}
                      className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded disabled:opacity-30 transition-colors"
                    >
                      <GripVertical size={14} className="text-surface-400 -rotate-90" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded',
                        MILESTONE_STATUS_CONFIG[milestone.status].bgColor,
                        MILESTONE_STATUS_CONFIG[milestone.status].color
                      )}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-surface-900 dark:text-white truncate">
                        {milestone.title}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-surface-500 truncate mt-1">
                        {milestone.description}
                      </p>
                    )}
                  </div>

                  <span className={cn(
                    'text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0',
                    MILESTONE_STATUS_CONFIG[milestone.status].bgColor,
                    MILESTONE_STATUS_CONFIG[milestone.status].color
                  )}>
                    {isHe
                      ? MILESTONE_STATUS_CONFIG[milestone.status].labelHe
                      : MILESTONE_STATUS_CONFIG[milestone.status].label
                    }
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingId(milestone.id)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-surface-500" />
                    </button>
                    <button
                      onClick={() => deleteMilestone(milestone.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <button
        onClick={addMilestone}
        className="w-full p-4 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 hover:border-accent-400 dark:hover:border-accent-600 text-surface-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        {isHe ? 'הוסף שלב' : 'Add Milestone'}
      </button>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        {onClose && (
          <PortalButton variant="ghost" onClick={onClose}>
            {isHe ? 'ביטול' : 'Cancel'}
          </PortalButton>
        )}
        <PortalButton
          variant="primary"
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving}
        >
          <Save size={16} className="me-2" />
          {isHe ? 'שמור שלבים' : 'Save Milestones'}
        </PortalButton>
      </div>
    </div>
  );
};

// Quick milestone templates for agencies
export const MILESTONE_TEMPLATES = {
  shopify: [
    { title: 'Discovery & Planning', titleHe: 'גילוי ותכנון' },
    { title: 'Design & Mockups', titleHe: 'עיצוב ומוקאפים' },
    { title: 'Development', titleHe: 'פיתוח' },
    { title: 'Content & Products', titleHe: 'תוכן ומוצרים' },
    { title: 'Testing & QA', titleHe: 'בדיקות ואבטחת איכות' },
    { title: 'Launch', titleHe: 'השקה' },
  ],
  wordpress: [
    { title: 'Requirements Gathering', titleHe: 'איסוף דרישות' },
    { title: 'Design Concept', titleHe: 'קונספט עיצובי' },
    { title: 'Development', titleHe: 'פיתוח' },
    { title: 'Content Integration', titleHe: 'שילוב תוכן' },
    { title: 'Review & Revisions', titleHe: 'סקירה ותיקונים' },
    { title: 'Go Live', titleHe: 'עלייה לאוויר' },
  ],
  maintenance: [
    { title: 'Issue Assessment', titleHe: 'הערכת הבעיה' },
    { title: 'Solution Planning', titleHe: 'תכנון פתרון' },
    { title: 'Implementation', titleHe: 'יישום' },
    { title: 'Testing', titleHe: 'בדיקות' },
    { title: 'Deployment', titleHe: 'העלאה' },
  ],
};

export const applyTemplate = (
  templateKey: keyof typeof MILESTONE_TEMPLATES,
  locale: string
): Milestone[] => {
  const template = MILESTONE_TEMPLATES[templateKey];
  const now = Timestamp.now();
  const isHe = locale === 'he';

  return template.map((item, index) => ({
    id: generateMilestoneId(),
    title: isHe ? item.titleHe : item.title,
    status: MILESTONE_STATUS.PENDING as MilestoneStatus,
    order: index,
    createdAt: now,
    updatedAt: now,
  }));
};
