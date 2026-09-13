import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://github.com/Bruno-A-Z/JAVA-CHALLENGE-FIAP-2026.git:3000/agendamentos'; 

export function useAgendamentos() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar agendamentos');
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (novoAgendamento) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAgendamento)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['agendamentos'])
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => queryClient.invalidateQueries(['agendamentos'])
  });

  return { query, createMutation, deleteMutation };
}