import {FC, useEffect, useState} from "react";
import { MetricItemCard } from "@/components/dashboard/MetricItemCard.tsx";
import {
    BriefcaseIcon,
    CalendarIcon,
    ReceiptPercentIcon,
    UserIcon
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { DepartmentDistributionChart } from "@/components/dashboard/DepartmentDistributionChart.tsx";
import { PromoDistributionChart } from "@/components/dashboard/PromoDistributionChart.tsx";
import { UsedPromoCodesChart } from "@/components/dashboard/UsedPromoCodesChart.tsx";
import { TransactionLineChart } from "@/components/dashboard/TransactionLineChart.tsx";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome.tsx";
import {fetchTotalEvents, fetchTotalPromos, fetchUsedPromos} from "@/api/endpoints/statistics.ts";

export const DashboardContent: FC = () => {
    const [active, setActive] = useState<"events" | "usedPromo" | "promos" | "transactions" | null>(null);
    const [totals, setTotals] = useState({
        events: 0,
        promos: 0,
        usedPromos: 0
    });

    useEffect(() => {
        const loadTotals = async () => {
            try {
                const [events, promos, usedPromos] = await Promise.all([
                    fetchTotalEvents(),
                    fetchTotalPromos(),
                    fetchUsedPromos()
                ]);

                setTotals({
                    events,
                    promos,
                    usedPromos
                });
            } catch (error) {
                console.error("Failed to fetch totals", error);
            }
        };

        loadTotals();
    }, []);


    const renderContent = () => {
        switch (active) {
            case "transactions":
                return <TransactionLineChart  />
            case "events":
                return <DepartmentDistributionChart />
            case "promos":
                return <PromoDistributionChart />
            case "usedPromo":
                return <UsedPromoCodesChart />;
            default:
                return <DashboardWelcome />;
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10 mt-5">
                <MetricItemCard
                    icon={<BriefcaseIcon width={50} />}
                    name={"Статистика по транзакциям"}
                    onClick={() => {
                        setActive("transactions");
                    }}
                />
                <MetricItemCard
                    icon={<CalendarIcon width={50} />}
                    name={"Всего мероприятий"}
                    num={totals.events}
                    onClick={() => setActive("events")}
                />
                <MetricItemCard
                    icon={<UserIcon width={50} />}
                    name={"Всего промокодов"}
                    num={totals.promos}
                    onClick={() => setActive("promos")}
                />
                <MetricItemCard
                    icon={<ReceiptPercentIcon width={50} />}
                    name={"Использованные промокоды"}
                    num={totals.usedPromos}
                    onClick={() => setActive("usedPromo")}
                />

            </div>

            <div className="mt-6 lg:mt-10 min-h-[300px] overflow-x-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
