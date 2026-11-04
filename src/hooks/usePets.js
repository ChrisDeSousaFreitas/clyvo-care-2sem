import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { extractCollection } from '../api/axiosConfig';

export const usePets = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const response = await api.get('/pet', {
        params: { page: 0, size: 100, sort: 'nome,asc' },
      });
      return extractCollection(response.data);
    },
  });

  const createMutation = useMutation({
    mutationFn: (newPet) => api.post('/pet', newPet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...petData }) => api.put(`/pet/${id}`, petData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (petId) => api.delete(`/pet/${petId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  return { query, createMutation, updateMutation, deleteMutation };
};
