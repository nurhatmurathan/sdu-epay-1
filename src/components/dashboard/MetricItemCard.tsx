import { FC, ReactNode } from "react";

interface MetricItemCardProps {
    name: string;
    num?: number;
    icon: ReactNode;
    onClick?: () => void;
}

export const MetricItemCard: FC<MetricItemCardProps> = ({ name, num, icon, onClick }) => {
    return (
        <div onClick={onClick} className="bg-white w-full cursor-pointer rounded-2xl p-4 lg:p-5 border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="text-gray-500 text-sm lg:text-base">{name}</div>
                <div className="text-blue-600 bg-blue-100 p-2 rounded-full flex-shrink-0">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{num}</p>
            </div>
        </div>
    );
};
