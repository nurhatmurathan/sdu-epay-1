import { api } from "@/api/api.ts";
import { OrdersResponse, OrderQuery, OrderDetails } from "@/types/orders.ts";
import { OrderTransactions } from "@/types/transactions.ts";

export const getOrders = async (query?: OrderQuery): Promise<OrdersResponse> => {
    const queryString = query
        ? '?' + new URLSearchParams(
            Object.entries(query).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString()
        : '';

    const { data } = await api.get(`/orders${queryString}`);
    return data;
}

export const getOrderById = async (id: number): Promise<OrderDetails> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
}

export const getOrderTransactions = async (orderId: number): Promise<OrderTransactions> => {
    const { data } = await api.get(`/order-transactions/list/${orderId}`);
    return data;
}

