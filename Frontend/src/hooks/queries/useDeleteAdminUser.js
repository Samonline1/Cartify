import { useMutation } from "@tanstack/react-query";
import API from "../../api";

export function useDeleteAdminUser() {
  return useMutation({
    mutationFn: async (id) => (await API.delete(`/admin/users/${id}`)).data,
  });
}
