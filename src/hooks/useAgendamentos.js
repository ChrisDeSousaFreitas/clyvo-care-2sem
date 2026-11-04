import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { extractCollection } from '../api/axiosConfig';

export const useAgendamentos = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const response = await api.get('/agendamento', {
        params: { page: 0, size: 100, sort: 'dataHora,asc' },
      });
      return extractCollection(response.data);
    },
  });

  const createMutation = useMutation({
    mutationFn: (newAppointment) => api.post('/agendamento', newAppointment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId) => api.patch(`/agendamento/${appointmentId}/cancelar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  });

  return { query, createMutation, cancelMutation };
};
