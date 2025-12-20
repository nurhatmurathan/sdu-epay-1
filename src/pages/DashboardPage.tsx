import {FC} from "react";
import {AdminLayout} from "@/layouts/AdminLayout.tsx";
import {DashboardContent} from "@/components/dashboard/DashboardContent.tsx";

export const DashboardPage:FC = () => {
    return (
        <AdminLayout>
            <p className={"text-xl lg:text-2xl font-semibold mb-4 lg:mb-0"}>Панель управления</p>
            <DashboardContent />
        </AdminLayout>
    )
}