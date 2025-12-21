import { create } from "zustand";
import { Order, OrderQuery } from "@/types/orders.ts";
import { getOrders } from "@/api/endpoints/orders.ts";

interface OrdersState {
    orders: Order[];
    total: number;
    loading: boolean;
    error: string | null;
    fetchOrders: (query?: OrderQuery) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
    orders: [],
    total: 0,
    loading: false,
    error: null,

    fetchOrders: async (query?: OrderQuery) => {
        set({ loading: true, error: null });
        try {
            const response = await getOrders(query);
            set({
                orders: response.data,
                total: response.total,
                loading: false,
            });
        } catch (error: any) {
            set({
                error: error.message || "Failed to fetch orders",
                loading: false,
            });
        }
    },
}));

