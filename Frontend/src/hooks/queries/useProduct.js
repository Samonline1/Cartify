import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../../api/products";

export function useProduct(id) {
    return useQuery({
        queryKey: ["product", id],

        queryFn: () => fetchProduct(id),

        enabled: !!id,

        staleTime: 1000 * 60 * 10,
    });
}