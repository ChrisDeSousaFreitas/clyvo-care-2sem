import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosConfig';

export const usePets = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const response = await api.get('/pets');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newPet) => await api.post('/pets', newPet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
    onError: (error) => {
      console.error("ERRO AO CRIAR PET:", error);
      alert('Erro na API: Não foi possível salvar o pet. Verifique seu backend.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...petData }) => await api.put(`/pets/${id}`, petData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
    onError: (error) => {
      console.error("ERRO AO ATUALIZAR PET:", error);
      alert('Erro na API: Não foi possível editar o pet. Verifique seu backend.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (petId) => await api.delete(`/pets/${petId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
    onError: (error) => {
      console.error("ERRO AO EXCLUIR PET:", error);
      alert('Erro na API: Não foi possível excluir o pet.');
    }
  });

  return { query, createMutation, updateMutation, deleteMutation };
};