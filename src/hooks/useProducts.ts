import { useQuery } from '@tanstack/react-query';
import {
  getProductById, getFeaturedProducts, getPopularProducts, getSimilarProducts
} from '../firebase/products';

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getFeaturedProducts(8),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularProducts = () => {
  return useQuery({
    queryKey: ['popular-products'],
    queryFn: () => getPopularProducts(8),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSimilarProducts = (category: string, excludeId: string) => {
  return useQuery({
    queryKey: ['similar-products', category, excludeId],
    queryFn: () => getSimilarProducts(category, excludeId),
    enabled: !!category && !!excludeId,
  });
};
