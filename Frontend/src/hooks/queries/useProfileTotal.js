import { useQuery } from "@tanstack/react-query";
import { fetchProfileCheckoutTotal } from "../../api/products";

export function useProfileTotal(enabled) {
  return useQuery({
    queryKey: ["profile", "total"],
    queryFn: fetchProfileCheckoutTotal,
    enabled,
    staleTime: 60 * 1000,
  });
}
