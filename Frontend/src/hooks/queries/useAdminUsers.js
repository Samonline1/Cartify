import { useQuery } from "@tanstack/react-query";
import API from "../../api";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => (await API.get("/admin/users")).data,
  });
}
