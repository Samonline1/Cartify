import { useQuery } from "@tanstack/react-query";
import API from "../../api";

export function useAdminUser(selectedUserId) {
  return useQuery({
    queryKey: ["admin", "user", selectedUserId],
    queryFn: async () => (await API.get(`/admin/users/${selectedUserId}`)).data,
    enabled: !!selectedUserId,
  });
}
