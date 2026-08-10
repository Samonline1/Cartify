import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../../api/products";

export function useProductsByCategory(name) {
  return useQuery({
    queryKey: ["category", name],
    queryFn: () => fetchProductsByCategory(name),
    enabled: !!name?.trim(),
    staleTime: 5 * 60 * 1000,
  });
}
