import { useMutation } from "@tanstack/react-query";
import { deleteCartItem } from "../../api/products";

export function useDeleteCartItem() {
  return useMutation({
    mutationFn: deleteCartItem,
  });
}
