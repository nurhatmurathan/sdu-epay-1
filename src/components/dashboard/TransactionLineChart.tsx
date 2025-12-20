import { FC, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { getDepartmentOrders } from "@/api/endpoints/statistics";
import { StatisticsDepartmentData } from "@/types/statistics";
import { format } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const colors = [
    { borderColor: "rgba(75,192,192,1)", backgroundColor: "rgba(75,192,192,0.2)" },
    { borderColor: "rgba(255,99,132,1)", backgroundColor: "rgba(255,99,132,0.2)" },
    { borderColor: "rgba(54, 162, 235, 1)", backgroundColor: "rgba(54, 162, 235, 0.2)" },
    { borderColor: "rgba(255, 206, 86, 1)", backgroundColor: "rgba(255, 206, 86, 0.2)" },
];

const predefinedRanges = [
    { label: "За день", value: "day" },
    { label: "За неделю", value: "week" },
    { label: "За месяц", value: "month" },
    { label: "За год", value: "year" },
];

export const TransactionLineChart: FC = () => {
    const [data, setData] = useState<StatisticsDepartmentData[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date("2024-06-01"),
        new Date("2025-06-01"),
    ]);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    const applyPresetRange = (preset: string) => {
        const now = new Date();
        let from = new Date(now);
        switch (preset) {
            case "day":
                from.setDate(now.getDate() - 1);
                break;
            case "week":
                from.setDate(now.getDate() - 7);
                break;
            case "month":
                from.setMonth(now.getMonth() - 1);
                break;
            case "year":
                from.setFullYear(now.getFullYear() - 1);
                break;
        }
        setDateRange([from, now]);
    };

    const fetchData = async () => {
        let [start, end] = dateRange;
        if (!start) return;

        if (!end) {
            start = new Date(start);
            end = new Date(start);
            end.setDate(end.getDate() + 1);
        }

        const formattedStart = format(start, "yyyy-MM-dd");
        const formattedEnd = format(end, "yyyy-MM-dd");

        const response = await getDepartmentOrders({
            start_date: formattedStart,
            end_date: formattedEnd,
        });

        setData(response);
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    function formatBucket(bucket: string, diffHours: number): string {
        const date = new Date(bucket);
        if (diffHours <= 48) {
            return date.toLocaleString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
            });
        } else if (diffHours <= 24 * 30) {
            return date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } else {
            return date.toLocaleDateString("ru-RU", {
                month: "short",
                year: "numeric",
            });
        }
    }

    const chartData = useMemo(() => {
        if (!data.length || !dateRange[0] || !dateRange[1]) return null;

        const [start, end] = dateRange;
        const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        const labels = data[0].time_buckets
            .filter(bucket => {
                const bucketTime = new Date(bucket.bucket).getTime();
                return bucketTime >= start.getTime() && bucketTime <= end.getTime();
            })
            .map(b => formatBucket(b.bucket, diffHours));

        const datasets = data.map((dep, idx) => {
            const filtered = dep.time_buckets.filter(tb => {
                const time = new Date(tb.bucket).getTime();
                return time >= start.getTime() && time <= end.getTime();
            });

            return {
                label: dep.department_name,
                data: filtered.map(b => b.amount_sum),
                borderColor: colors[idx % colors.length].borderColor,
                backgroundColor: colors[idx % colors.length].backgroundColor,
                tension: 0.4,
            };
        });

        return { labels, datasets };
    }, [data, dateRange]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="w-full max-w-full px-2 lg:px-4">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">График транзакций</h2>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-start sm:items-center mb-4 lg:mb-6">
                <label className="flex flex-col w-full sm:w-auto">
                    <span className="text-sm mb-1">Выберите диапазон дат:</span>
                    <Calendar
                        selectionMode="range"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.value as [Date, Date])}
                        view="date"
                        dateFormat="dd/mm/yy"
                        className="bg-white w-full sm:w-auto"
                        showIcon
                        showButtonBar
                    />
                </label>

                <label className="flex flex-col w-full sm:w-auto">
                    <span className="text-sm mb-1">Быстрый выбор периода:</span>
                    <Dropdown
                        value={selectedPreset}
                        options={predefinedRanges}
                        onChange={(e) => {
                            setSelectedPreset(e.value);
                            applyPresetRange(e.value);
                        }}
                        placeholder="Выбрать"
                        className="w-full sm:min-w-[12rem]"
                    />
                </label>
            </div>

            <div className="bg-white p-4 lg:p-6 rounded-2xl w-full overflow-x-auto">
                {chartData ? (
                    <div className="min-w-[300px]">
                        <Line data={chartData} options={options} />
                    </div>
                ) : (
                    <p>За этот период нету данных</p>
                )}
            </div>
        </div>
    );
};
