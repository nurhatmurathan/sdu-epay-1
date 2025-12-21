import { FC, useEffect, useState } from "react";
import { CustomModal } from "@/ui/CustomModal.tsx";
import { Order } from "@/types/orders.ts";
import { OrderTransactions } from "@/types/transactions.ts";
import { getOrderTransactions } from "@/api/endpoints/orders.ts";
import { PulseLoader } from "react-spinners";

interface OrderTransactionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export const OrderTransactionsModal: FC<OrderTransactionsModalProps> = ({ isOpen, onClose, order }) => {
    const [transactions, setTransactions] = useState<OrderTransactions | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!order || !isOpen) return;
            
            setLoading(true);
            try {
                const data = await getOrderTransactions(order.id);
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [order, isOpen]);

    if (!order) return null;

    if (loading) {
        return (
            <CustomModal
                title={`Транзакции заказа #${order.id}`}
                isOpen={isOpen}
                className="max-w-4xl w-full"
                onClose={onClose}
            >
                <div className="flex justify-center items-center py-8">
                    <PulseLoader size={10} color="#006799" />
                </div>
            </CustomModal>
        );
    }

    if (!transactions) {
        return (
            <CustomModal
                title={`Транзакции заказа #${order.id}`}
                isOpen={isOpen}
                className="max-w-4xl w-full"
                onClose={onClose}
            >
                <div className="text-center py-8 text-gray-500">
                    Не удалось загрузить транзакции
                </div>
            </CustomModal>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const hasTransactions = 
        transactions.kaspi_transactions.length > 0 ||
        transactions.kaspi_fastpay_transactions.length > 0 ||
        transactions.epay_transactions.length > 0;

    return (
        <CustomModal
            title={`Транзакции заказа #${order.id}`}
            isOpen={isOpen}
            className="max-w-4xl w-full"
            onClose={onClose}
        >
            <div className="space-y-6">
                <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                        Тип оплаты: <span className="font-semibold">{transactions.order_type === "KASPI" ? "Kaspi" : "Halyk"}</span>
                    </p>
                </div>

                {!hasTransactions && (
                    <div className="text-center py-8 text-gray-500">
                        Транзакции не найдены
                    </div>
                )}

                {/* Kaspi Transactions */}
                {transactions.kaspi_transactions.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3 text-blue-900">Kaspi транзакции</h3>
                        <div className="space-y-3">
                            {transactions.kaspi_transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-blue-50 p-4 rounded-md border border-blue-200">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Команда</p>
                                            <p className="font-semibold">{transaction.command}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Результат</p>
                                            <p className="font-semibold">{transaction.result}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Сумма</p>
                                            <p className="font-semibold">{transaction.sum} ₸≠</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-600">Комментарий</p>
                                            <p className="font-semibold text-sm">{transaction.comment || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Дата</p>
                                            <p className="font-semibold text-sm">{transaction.date}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-3">
                                            <p className="text-xs text-gray-500">Создано: {formatDate(transaction.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Kaspi Fastpay Transactions */}
                {transactions.kaspi_fastpay_transactions.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3 text-purple-900">Kaspi Fastpay транзакции</h3>
                        <div className="space-y-3">
                            {transactions.kaspi_fastpay_transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-purple-50 p-4 rounded-md border border-purple-200">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Сумма</p>
                                            <p className="font-semibold">{transaction.amount_tiyn} ₸</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Код</p>
                                            <p className="font-semibold">{transaction.code}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Устройство</p>
                                            <p className="font-semibold">{transaction.device}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-3">
                                            <p className="text-xs text-gray-600">Сообщение</p>
                                            <p className="font-semibold text-sm">{transaction.message || "-"}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-3">
                                            <p className="text-xs text-gray-500">Создано: {formatDate(transaction.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Epay Transactions */}
                {transactions.epay_transactions.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-3 text-green-900">Halyk (EPay) транзакции</h3>
                        <div className="space-y-3">
                            {transactions.epay_transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-green-50 p-4 rounded-md border border-green-200">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Код подтверждения</p>
                                            <p className="font-semibold">{transaction.approval_code || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Маска карты</p>
                                            <p className="font-semibold">{transaction.card_mask || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Тип карты</p>
                                            <p className="font-semibold">{transaction.card_type || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Код</p>
                                            <p className="font-semibold">{transaction.code}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Валюта</p>
                                            <p className="font-semibold">{transaction.currency}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Референс</p>
                                            <p className="font-semibold text-sm">{transaction.reference || "-"}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-3">
                                            <p className="text-xs text-gray-600">Описание</p>
                                            <p className="font-semibold text-sm">{transaction.description || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Имя</p>
                                            <p className="font-semibold text-sm">{transaction.name || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Email</p>
                                            <p className="font-semibold text-sm">{transaction.email || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Телефон</p>
                                            <p className="font-semibold text-sm">{transaction.phone || "-"}</p>
                                        </div>
                                        {transaction.reason && (
                                            <div className="col-span-2 md:col-span-3">
                                                <p className="text-xs text-gray-600">Причина</p>
                                                <p className="font-semibold text-sm text-red-600">
                                                    {transaction.reason} (Код: {transaction.reason_code})
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-600">Дата/время</p>
                                            <p className="font-semibold text-sm">{transaction.date_time}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">Создано: {formatDate(transaction.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CustomModal>
    );
};

