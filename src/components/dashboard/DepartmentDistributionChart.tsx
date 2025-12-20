import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { FC, useEffect, useState } from "react";
import {fetchEventsDistrubution} from "@/api/endpoints/statistics.ts";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context: any) => `${context.parsed.y} events`,
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Events",
            },
        },
        x: {
            title: {
                display: true,
                text: "Departments",
            },
        },
    },
};

interface DepartmentStat {
    department_id: string;
    department_name: string;
    total: number;
}

export const DepartmentDistributionChart: FC = () => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchDepartmentStats = async () => {
            try {
                const data:DepartmentStat[] = await fetchEventsDistrubution();

                const labels = data.map((item) => item.department_name);
                const totals = data.map((item) => item.total);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Number of Events",
                            data: totals,
                            backgroundColor: "#6366f1",
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to fetch department stats:", error);
            }
        };

        fetchDepartmentStats();
    }, []);

    return (
        <div className="w-full max-w-full px-2 lg:px-4">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Распределение активных событии по департаментам</h2>
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
