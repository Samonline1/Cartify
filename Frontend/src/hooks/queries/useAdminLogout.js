import { useMutation } from "@tanstack/react-query";
import API from "../../api";

export function useAdminLogout() {
  return useMutation({
    mutationFn: async () => API.post("/admin/logout"),
  });
}
