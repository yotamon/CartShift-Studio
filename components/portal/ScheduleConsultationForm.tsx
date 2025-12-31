'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
  X,
  Calendar,
  Clock,
  Users,
  FileText,
  ExternalLink,
  UserPlus,
  Target,
  ClipboardCheck,
  Headphones,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import {
  ConsultationType,
  CONSULTATION_TYPE,
  CONSULTATION_TYPE_CONFIG,
} from '@/lib/types/portal';
import {
  createConsultation,
  CreateConsultationData,
} from '@/lib/services/portal-consultations';
import {
  openCalendarEventPopup,
} from '@/lib/schedule';
import {
  tryCreateCalendarEventForConsultation,
  getCalendarConnection,
  getFreeBusyIntervals,
  initiateGoogleOAuth
} from '@/lib/services/portal-google-calendar';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';

const typeIcons: Record<ConsultationType, React.ElementType> = {
  onboarding: UserPlus,
  strategy: Target,
  project_review: ClipboardCheck,
  support: Headphones,
};

interface ScheduleConsultationFormProps {
  orgId: string;
  orgName?: string;
  clientEmail?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ScheduleConsultationForm({
  orgId,
  orgName,
  clientEmail,
  onClose,
  onSuccess,
}: ScheduleConsultationFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { userData } = usePortalAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ConsultationType>(CONSULTATION_TYPE.ONBOARDING);
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const [autoCreated, setAutoCreated] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  // Smart Calendar Features
  const [isConnected, setIsConnected] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [busySlots, setBusySlots] = useState<{ start: Date; end: Date }[]>([]);

  useEffect(() => {
    getCalendarConnection().then(conn => setIsConnected(conn.connected));
  }, []);

  useEffect(() => {
    if (isConnected && scheduledDate) {
      setCheckingAvailability(true);
      const start = new Date(scheduledDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(scheduledDate);
      end.setHours(23, 59, 59, 999);

      getFreeBusyIntervals(start, end)
        .then(slots => {
          setBusySlots(slots);
        })
        .finally(() => {
          setCheckingAvailability(false);
        });
    }
  }, [isConnected, scheduledDate]);

  const hasConflict = useMemo(() => {
    if (!scheduledDate || !scheduledTime) return false;
    const start = new Date(`${scheduledDate}T${scheduledTime}`);
    const end = new Date(start.getTime() + duration * 60000);

    return busySlots.some(slot =>
      (start < slot.end && end > slot.start)
    );
  }, [scheduledDate, scheduledTime, duration, busySlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData || !title || !scheduledDate || !scheduledTime) return;

    if (hasConflict && !window.confirm('There is a calendar conflict. Do you want to proceed anyway?')) {
        return;
    }

    setLoading(true);

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

      // Try to create calendar event (auto-creates if connected, otherwise generates link)
      const calendarResult = await tryCreateCalendarEventForConsultation({
        title,
        description,
        scheduledAt,
        durationMinutes: duration,
        attendeeEmails: clientEmail ? [clientEmail] : undefined,
        clientName: orgName,
        orgId,
        type, // Pass the type for color coding
      });

      const consultationData: CreateConsultationData = {
        orgId,
        type,
        title,
        description,
        scheduledAt,
        duration,
        externalCalendarLink: calendarResult.fallbackLink,
      };

      await createConsultation(userData.id, userData.name || 'Agency', consultationData);

      setAutoCreated(calendarResult.success);
      setMeetLink(calendarResult.meetLink || null);
      setCalendarUrl(calendarResult.fallbackLink || null);
      setSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (calendarUrl) {
      openCalendarEventPopup(calendarUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white">
                  {t('portal.consultations.schedule' as any) || 'Schedule Consultation'}
                </h2>
                {orgName && (
                  <p className="text-sm text-surface-500">{orgName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <X size={20} className="text-surface-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                Consultation Scheduled!
              </h3>
              {autoCreated ? (
                <>
                  <p className="text-surface-500 mb-2">
                    ✨ Calendar event created automatically!
                  </p>
                  {meetLink && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-6">
                      Meet link: {meetLink}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-surface-500 mb-6">
                  Add this meeting to your Google Calendar to get a Meet link automatically.
                </p>
              )}
              <div className="flex gap-3 justify-center">
                {!autoCreated && calendarUrl && (
                  <PortalButton
                    variant="primary"
                    onClick={handleAddToCalendar}
                    className="gap-2"
                  >
                    <Calendar size={18} />
                    Add to Google Calendar
                    <ExternalLink size={14} className="opacity-60" />
                  </PortalButton>
                )}
                <PortalButton variant={autoCreated ? 'primary' : 'outline'} onClick={onClose}>
                  Done
                </PortalButton>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Connection Status Banner */}
              {!isConnected ? (
                <div className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-xl border border-dashed border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                        <LinkIcon size={16} />
                        <span>Link Google Calendar for auto-sync</span>
                    </div>
                    <button
                        type="button"
                        onClick={initiateGoogleOAuth}
                        className="text-xs font-bold text-blue-600 hover:underline"
                    >
                        Connect Now
                    </button>
                </div>
              ) : (
                 <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg w-fit">
                    <CheckCircle2 size={12} />
                    <span>Calendar synced & checking availability</span>
                 </div>
              )}

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                  {t('portal.consultations.form.type' as any) || 'Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(CONSULTATION_TYPE).map((typeOption) => {
                    const config = CONSULTATION_TYPE_CONFIG[typeOption];
                    const Icon = typeIcons[typeOption];
                    return (
                      <button
                        key={typeOption}
                        type="button"
                        onClick={() => setType(typeOption)}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all flex items-center gap-2',
                          type === typeOption
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', config.color)} />
                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          {locale === 'he' ? config.labelHe : config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                  {t('portal.consultations.form.title' as any) || 'Meeting Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('portal.consultations.form.titlePlaceholder' as any) || 'e.g., Strategy Discussion'}
                  className="portal-input w-full"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                      <Calendar size={14} className="inline me-1" />
                      {t('portal.consultations.form.date' as any) || 'Date'}
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="portal-input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                      <Clock size={14} className="inline me-1" />
                      {t('portal.consultations.form.time' as any) || 'Time'}
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className={cn(
                        "portal-input w-full",
                        hasConflict && "border-red-500 focus:border-red-500 focus:ring-red-200"
                       )}
                      required
                    />
                  </div>
                </div>

                {/* Availability Status */}
                {scheduledDate && isConnected && (
                    <div className="text-xs min-h-[20px]">
                        {checkingAvailability ? (
                            <span className="flex items-center gap-1 text-surface-500">
                                <Loader2 size={12} className="animate-spin" />
                                Checking availability...
                            </span>
                        ) : hasConflict ? (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"
                            >
                                <AlertTriangle size={14} />
                                <span>Conflict detected with your calendar</span>
                            </motion.div>
                        ) : scheduledTime ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Available
                            </span>
                        ) : null}
                    </div>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                  <Clock size={14} className="inline me-1" />
                  {t('portal.consultations.form.duration' as any) || 'Duration'}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="portal-input w-full"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">
                  <FileText size={14} className="inline me-1" />
                  {t('portal.consultations.form.notes' as any) || 'Agenda / Notes'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('portal.consultations.form.notesPlaceholder' as any) || 'What will you discuss?'}
                  rows={3}
                  className="portal-input w-full resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <PortalButton
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  {t('portal.common.cancel')}
                </PortalButton>
                <PortalButton
                  type="submit"
                  variant="primary"
                  className="flex-1 gap-2"
                  disabled={loading || !title || !scheduledDate || !scheduledTime}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Calendar size={18} />
                      Schedule
                    </>
                  )}
                </PortalButton>
              </div>

              <p className="text-xs text-center text-surface-500 pt-2">
                {!isConnected ?
                    "📅 After scheduling, you'll be prompted to add this to Google Calendar with a Meet link" :
                    "✨ Event will be automatically added to your Google Calendar with Meet link"
                }
              </p>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
