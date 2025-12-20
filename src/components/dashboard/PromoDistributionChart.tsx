import { FC, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import {fetchPromocodesDistrubution} from "@/api/endpoints/statistics.ts";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context: any) => `${context.parsed.y} promo codes`,
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Promo Codes",
            },
        },
        x: {
            title: {
                display: true,
                text: "Events",
            },
        },
    },
};

interface PromoEventStat {
    event_id: string;
    event_title: string;
    total: number;
}

export const PromoDistributionChart: FC = () => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchPromoDistribution = async () => {
            try {
                const data: PromoEventStat[] = await fetchPromocodesDistrubution();

                const labels = data.map((item) => item.event_title);
                const totals = data.map((item) => item.total);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Promo codes count",
                            data: totals,
                            backgroundColor: "#10b981",
                        },
                    ],
                });
            } catch (error) {
                console.error("Ошибка при получении данных промо-распределения", error);
            }
        };

        fetchPromoDistribution();
    }, []);

    return (
        <div className="w-full max-w-full px-2 lg:px-4">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Распространение промо-кодов по событиям</h2>
            <div className="bg-white p-4 lg:p-6 rounded-2xl w-full overflow-x-auto">
                {chartData ? (
                    <div className="min-w-[300px]">
                        <Bar data={chartData} options={options} />
                    </div>
                ) : (
                    <div>Загрузка...</div>
                )}
            </div>
        </div>
    );
};
