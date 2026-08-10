import { useQuery } from "@tanstack/react-query";
import { fetchProductSearch } from "../../api/products";

export function useProductSearch(name) {
  return useQuery({
    queryKey: ["search", name],
    queryFn: () => fetchProductSearch(name),
    enabled: !!name?.trim(),
    staleTime: 5 * 60 * 1000,
  });
}
