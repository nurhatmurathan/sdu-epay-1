import { FC, useState } from "react";
import { CustomSelect } from "@/ui/CustomSelect.tsx";
import { CustomButton } from "@/ui/CustomButton.tsx";
import { useOrdersStore } from "@/store/useOrdersStore.ts";

export const OrdersFilters: FC = () => {
    const [orderId, setOrderId] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const { fetchOrders } = useOrdersStore();

    const typeOptions = [
        { label: "Все типы", value: "" },
        { label: "Kaspi", value: "KASPI" },
        { label: "Halyk", value: "EPAY" },
    ];

    const statusOptions = [
        { label: "Все статусы", value: "" },
        { label: "В ожидании", value: "PENDING" },
        { label: "Успешно", value: "SUCCESS" },
        { label: "Ошибка", value: "FAILURE" },
    ];

    const handleSearch = async () => {
        await fetchOrders({
            id: orderId ? Number(orderId) : null,
            type: (type as "KASPI" | "EPAY") || null,
            status: (status as "PENDING" | "SUCCESS" | "FAILURE") || null,
            page: 0,
            size: 10,
        });
    };

    return (
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-6 lg:mb-[31px]">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-[22px] w-full lg:w-auto">
                <div className="flex flex-col gap-[10px] flex-1 sm:flex-none">
                    <label className="text-sm">ID заказа</label>
                    <input
                        type="number"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="bg-[#FFFFFF] h-[37px] p-2 border border-[#6B9AB0] rounded-[4px] text-sm"
                        placeholder="Введите ID"
                    />
                </div>
                <div className="flex flex-col gap-[10px] flex-1 sm:flex-none">
                    <label className="text-sm">Тип оплаты</label>
                    <CustomSelect
                        options={typeOptions}
                        value={type}
                        onChange={setType}
                        triggerClassName="bg-white w-full sm:min-w-[200px] h-[37px] text-black text-sm"
                        dropdownClassName="bg-gray-100"
                        optionClassName="text-sm"
                        activeOptionClassName="bg-blue-200"
                    />
                </div>
                <div className="flex flex-col gap-[10px] flex-1 sm:flex-none">
                    <label className="text-sm">Статус</label>
                    <CustomSelect
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                        triggerClassName="bg-white w-full sm:min-w-[200px] h-[37px] text-black text-sm"
                        dropdownClassName="bg-gray-100"
                        optionClassName="text-sm"
                        activeOptionClassName="bg-blue-200"
                    />
                </div>
                <CustomButton
                    onClick={handleSearch}
                    className="h-[37px] px-4 mt-auto text-white rounded-[4px] transition w-full sm:w-auto"
                >
                    Поиск
                </CustomButton>
            </div>
        </div>
    );
};

