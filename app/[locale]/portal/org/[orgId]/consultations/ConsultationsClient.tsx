'use client';

import React, { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  CheckCircle2,
  XCircle,
  UserPlus,
  Target,
  ClipboardCheck,
  Headphones,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import {
  Consultation,
  CONSULTATION_TYPE_CONFIG,
  CONSULTATION_STATUS_CONFIG,
  ConsultationType,
  CONSULTATION_STATUS,
} from '@/lib/types/portal';
import {
  subscribeToOrgConsultations,
  cancelConsultation,
} from '@/lib/services/portal-consultations';
import { deleteCalendarEvent } from '@/lib/services/portal-google-calendar';
import { getScheduleUrl } from '@/lib/schedule';
import { trackBookCallClick } from '@/lib/analytics';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';

const typeIcons: Record<ConsultationType, React.ElementType> = {
  onboarding: UserPlus,
  strategy: Target,
  project_review: ClipboardCheck,
  support: Headphones,
};

interface ConsultationsClientProps {
  orgId: string;
}

export default function ConsultationsClient({ orgId }: ConsultationsClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { userData } = usePortalAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const dateLocale = locale === 'he' ? he : enUS;

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string' || orgId === 'template') {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToOrgConsultations(orgId, data => {
      setConsultations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orgId]);

  const upcomingConsultations = consultations.filter(
    c => c.status === CONSULTATION_STATUS.SCHEDULED
  );
  const pastConsultations = consultations.filter(c => c.status !== CONSULTATION_STATUS.SCHEDULED);

  const handleScheduleClick = () => {
    trackBookCallClick('portal_consultations');
    window.open(getScheduleUrl(), '_blank');
  };

  const handleCancel = async (consultation: Consultation) => {
    if (
      !confirm(
        t('portal.consultations.cancelConfirm' as any) ||
          'Are you sure you want to cancel this consultation?'
      )
    ) {
      return;
    }

    setCancelingId(consultation.id);
    try {
      await cancelConsultation(
        consultation.id,
        consultation.orgId,
        userData?.id || 'unknown',
        userData?.name || 'User'
      );

      if (consultation.externalEventId) {
        // Attempt to delete from Google Calendar
        // We don't block on this, and failures are logged in the service
        deleteCalendarEvent(consultation.externalEventId).catch(console.error);
      }
    } catch (error) {
      console.error('Failed to cancel consultation:', error);
      alert('Failed to cancel consultation');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white font-outfit tracking-tight">
            {t('portal.consultations.title' as any) || 'Consultations'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {t('portal.consultations.clientSubtitle' as any) ||
              'View your scheduled meetings and consultation history'}
          </p>
        </div>
        <PortalButton variant="primary" className="gap-2" onClick={handleScheduleClick}>
          <Calendar size={18} />
          {t('portal.consultations.scheduleCall' as any) || 'Schedule a Call'}
          <ExternalLink size={14} className="opacity-60" />
        </PortalButton>
      </div>

      {/* Upcoming Consultations */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {t('portal.consultations.upcoming' as any) || 'Upcoming'}
          {upcomingConsultations.length > 0 && (
            <span className="ms-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg">
              {upcomingConsultations.length}
            </span>
          )}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : upcomingConsultations.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800">
            <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-surface-400" />
            </div>
            <h3 className="text-base font-bold text-surface-700 dark:text-surface-300 mb-2">
              {t('portal.consultations.noUpcoming' as any) || 'No upcoming consultations'}
            </h3>
            <p className="text-surface-500 text-sm mb-4">
              {t('portal.consultations.noUpcomingDesc' as any) ||
                'Ready to discuss your project? Schedule a call with our team.'}
            </p>
            <PortalButton variant="outline" onClick={handleScheduleClick} className="gap-2">
              <Calendar size={16} />
              {t('portal.consultations.scheduleNow' as any) || 'Schedule Now'}
            </PortalButton>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingConsultations.map((consultation, index) => {
              const TypeIcon = typeIcons[consultation.type];
              const typeConfig = CONSULTATION_TYPE_CONFIG[consultation.type];
              const scheduledDate = consultation.scheduledAt?.toDate
                ? consultation.scheduledAt.toDate()
                : new Date();

              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-white dark:bg-surface-900 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        typeConfig.bgColor
                      )}
                    >
                      <TypeIcon className={cn('w-6 h-6', typeConfig.color)} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                        {consultation.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-surface-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar size={14} className="text-blue-500" />
                          {format(scheduledDate, 'EEEE, MMMM d, yyyy', { locale: dateLocale })}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock size={14} className="text-blue-500" />
                          {format(scheduledDate, 'HH:mm', { locale: dateLocale })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {consultation.duration} min
                        </span>
                      </div>
                      {consultation.description && (
                        <p className="mt-3 text-sm text-surface-600 dark:text-surface-400">
                          {consultation.description}
                        </p>
                      )}
                      {consultation.agendaItems && consultation.agendaItems.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-bold text-surface-500 mb-2">Agenda</p>
                          <ul className="space-y-1">
                            {consultation.agendaItems.map((item, i) => (
                              <li
                                key={i}
                                className="text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {consultation.externalCalendarLink && (
                        <a
                          href={consultation.externalCalendarLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors justify-center"
                        >
                          <Video size={16} />
                          Join
                        </a>
                      )}
                      <button
                        onClick={() => handleCancel(consultation)}
                        disabled={cancelingId === consultation.id}
                        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl font-medium text-sm transition-colors justify-center disabled:opacity-50"
                      >
                        {cancelingId === consultation.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <XCircle size={16} />
                        )}
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Past Consultations */}
      {pastConsultations.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-surface-500" />
            {t('portal.consultations.past' as any) || 'Past Consultations'}
          </h2>

          <div className="space-y-3">
            {pastConsultations.map((consultation, index) => {
              const TypeIcon = typeIcons[consultation.type];
              const typeConfig = CONSULTATION_TYPE_CONFIG[consultation.type];
              const statusConfig = CONSULTATION_STATUS_CONFIG[consultation.status];
              const scheduledDate = consultation.scheduledAt?.toDate
                ? consultation.scheduledAt.toDate()
                : new Date();

              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 opacity-60',
                        typeConfig.bgColor
                      )}
                    >
                      <TypeIcon className={cn('w-5 h-5', typeConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-surface-700 dark:text-surface-300 truncate">
                        {consultation.title}
                      </h3>
                      <p className="text-xs text-surface-500">
                        {format(scheduledDate, 'MMM d, yyyy', { locale: dateLocale })}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold',
                        statusConfig.bgColor,
                        statusConfig.color
                      )}
                    >
                      {locale === 'he' ? statusConfig.labelHe : statusConfig.label}
                    </span>
                  </div>
                  {consultation.meetingNotes && (
                    <div className="mt-3 p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
                      <p className="text-xs font-bold text-surface-500 mb-1 flex items-center gap-1">
                        <MessageSquare size={12} />
                        {t('portal.consultations.notes' as any) || 'Meeting Notes'}
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {consultation.meetingNotes}
                      </p>
                    </div>
                  )}
                  {consultation.actionItems && consultation.actionItems.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-surface-500 mb-2">
                        {t('portal.consultations.actionItems' as any) || 'Action Items'}
                      </p>
                      <ul className="space-y-1">
                        {consultation.actionItems.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2"
                          >
                            <CheckCircle2 size={14} className="text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
