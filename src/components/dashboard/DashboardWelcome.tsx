import { FC } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export const DashboardWelcome: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-10 lg:py-20 px-4 bg-white rounded-xl text-center">
            <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 mb-4 lg:mb-6 bg-blue-100 text-blue-600 rounded-full">
                <ShieldCheckIcon className="w-8 h-8 lg:w-10 lg:h-10" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">Добро пожаловать в Админ Панель</h1>
            <p className="text-sm lg:text-base text-gray-600 max-w-xl">
                Используйте карточки выше, чтобы просматривать аналитику и отслеживать транзакции по департаментам,
                статистику мероприятий и активность промокодов. Выберите раздел, чтобы начать.
            </p>
        </div>
    );
};
