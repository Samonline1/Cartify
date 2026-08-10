import { useQuery } from "@tanstack/react-query";
import { fetchCheckoutItems, fetchCheckoutTotal } from "../../api/products";

export function useCheckoutItems() {
  return useQuery({
    queryKey: ["checkout", "items"],
    queryFn: fetchCheckoutItems,
    staleTime: 60 * 1000,
  });
}

export function useCheckoutTotal() {
  return useQuery({
    queryKey: ["checkout", "total"],
    queryFn: fetchCheckoutTotal,
    staleTime: 60 * 1000,
  });
}
