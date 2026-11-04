import { useQuery } from '@tanstack/react-query';
import api, { extractCollection } from '../api/axiosConfig';

export function useVeterinarios() {
  const query = useQuery({
    queryKey: ['veterinarios'],
    queryFn: async () => {
      const response = await api.get('/veterinario', {
        params: { page: 0, size: 100, sort: 'nome,asc' },
      });
      return extractCollection(response.data);
    },
  });

  return { query };
}
