import { useQuery } from "@tanstack/react-query";
import API from "../../api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => (await API.get("/admin/dashboard")).data,
  });
}
