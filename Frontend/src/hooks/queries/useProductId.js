import { useQuery } from "@tanstack/react-query";
import { fetchProductByID } from "../../api/products";

export function useProductId(id) {
    return useQuery({
        queryKey: ["product", id],

        queryFn: () => fetchProductByID(id),

        enabled: !!id,

        staleTime: 1000 * 60 * 10,
    });
}