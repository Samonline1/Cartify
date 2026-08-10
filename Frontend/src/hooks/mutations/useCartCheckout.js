import { useMutation } from "@tanstack/react-query";
import { postCartCheckout } from "../../api/products";

export function useCartCheckout() {
  return useMutation({
    mutationFn: postCartCheckout,
  });
}
