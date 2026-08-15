import { useQuery } from "@tanstack/react-query";
import { fetchProductByName } from "../../api/products";

export function useProductByName(name, enabled = true) {
    return useQuery({
        queryKey: ["product", name],

        queryFn: () => fetchProductByName(name),

        enabled:
            enabled &&
            typeof name === "string" &&
            name.trim().length > 0,

        staleTime: 1000 * 60 * 10,
    });

}