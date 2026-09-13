import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosConfig';

export const useAgendamentos = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const response = await api.get('/agendamentos');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (novoAgendamento) => await api.post('/agendamentos', novoAgendamento),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
    onError: (error) => {
      console.error("ERRO AO CRIAR AGENDAMENTO:", error);
      alert('Erro na API: Não foi possível salvar o agendamento. Verifique seu backend.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...agendamentoData }) => await api.put(`/agendamentos/${id}`, agendamentoData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
    onError: (error) => {
      console.error("ERRO AO ATUALIZAR AGENDAMENTO:", error);
      alert('Erro na API: Não foi possível editar o agendamento. Verifique seu backend.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (agendamentoId) => await api.delete(`/agendamentos/${agendamentoId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
    onError: (error) => {
      console.error("ERRO AO EXCLUIR AGENDAMENTO:", error);
      alert('Erro na API: Não foi possível excluir o agendamento.');
    }
  });

  return { query, createMutation, updateMutation, deleteMutation };
};