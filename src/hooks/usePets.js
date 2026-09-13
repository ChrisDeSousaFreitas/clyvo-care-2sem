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
  });

  const deleteMutation = useMutation({
    mutationFn: async (petId) => await api.delete(`/pets/${petId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  return { query, createMutation, deleteMutation };
};