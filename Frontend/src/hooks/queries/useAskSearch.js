import { useQuery } from "@tanstack/react-query";
import { searchWithAssistant } from "../../api/products";

export const useAskSearch = (query, enabled = false) => {
    return useQuery({
        queryKey: ["ai-search", query],
        queryFn: () => searchWithAssistant(query),
        enabled: enabled && Boolean(query.trim()),
    });
};