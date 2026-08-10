import { useQuery } from "@tanstack/react-query";
import { fetchHomeProducts } from "../../api/products";

export function useHomeProducts() {
  return useQuery({
    queryKey: ["home-products"],
    queryFn: fetchHomeProducts,
    staleTime: 5 * 60 * 1000,
  });
}
