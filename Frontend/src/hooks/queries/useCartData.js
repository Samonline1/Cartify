import { useQuery } from "@tanstack/react-query";
import { fetchCartItems, fetchCartTotal } from "../../api/products";

export function useCartItems() {
  return useQuery({
    queryKey: ["cart", "items"],
    queryFn: fetchCartItems,
  });
}

export function useCartTotal() {
  return useQuery({
    queryKey: ["cart", "total"],
    queryFn: fetchCartTotal,
  });
}
