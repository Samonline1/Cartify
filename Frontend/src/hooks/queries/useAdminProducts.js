import { useMutation } from "@tanstack/react-query";
import API from "../../api";

export function useAdminProducts() {
  return useMutation({
    mutationFn: async (query) =>
      (
        await API.get("/admin/products", {
          params: query ? { q: query } : {},
        })
      ).data,
  });
}
