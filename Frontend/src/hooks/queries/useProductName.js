import { useQuery } from "@tanstack/react-query";
import { fetchProductByName } from "../../api/products";

export function useProductByName(name) {
    return useQuery({
        queryKey: ["product", name],

        queryFn: () => fetchProductByName(name),

        enabled: name.trim().length > 0,

        staleTime: 1000 * 60 * 10,
    });

}