import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelConsultation, completeConsultation } from '@/lib/services/portal-consultations';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function useConsultationMutations() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const cancelMutation = useMutation({
    mutationFn: cancelConsultation,
    onSuccess: () => {
      toast.success(t('portal.consultations.cancelSuccess'));
      queryClient.invalidateQueries({ queryKey: ['org-consultations'] });
      queryClient.invalidateQueries({ queryKey: ['all-consultations'] });
    },
    onError: (error) => {
      console.error('Failed to cancel consultation:', error);
      toast.error(t('portal.consultations.failedToCancel'));
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeConsultation,
    onSuccess: () => {
      toast.success(t('portal.consultations.completeSuccess'));
      queryClient.invalidateQueries({ queryKey: ['org-consultations'] });
      queryClient.invalidateQueries({ queryKey: ['all-consultations'] });
    },
    onError: (error) => {
      console.error('Failed to complete consultation:', error);
      toast.error(t('portal.consultations.failedToComplete'));
    },
  });

  return {
    cancelConsultation: cancelMutation.mutate,
    cancelConsultationAsync: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,

    completeConsultation: completeMutation.mutate,
    completeConsultationAsync: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
  };
}
