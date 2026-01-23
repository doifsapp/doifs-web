'use client'

import { CardDashboard } from "../_components/cardDashboard";
import { SidebarMenu } from "../_components/sidebarMenu";
import { SideBar } from "../_components/sideBar";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { ChartArea } from "../_components/chartArea";
import { ChartPieRegional } from "../_components/chartPie";
import { Sigma, Newspaper } from "lucide-react";
import { ChartLineMultianual } from "../_components/chartBar";
import { ChartBarLabelCustom } from "../_components/chartBarHorizontal";
import { ChartStateGroupedBar } from "../_components/chartBarr";

//bg-violet-50
export default function Dashboard() {
    return (
        <section className="bg-black min-h-screen flex flex-row">
            <SidebarMenu />

            <div className="flex-1 flex flex-col items-center overflow-x-hidden">
                <div className="max-w-6xl">


                    <div className="w-full">
                        <CardDashboard />
                    </div>

                    <div className="pt-8">
                        <ChartArea />
                    </div>

                    <div className="pt-8">
                        <ChartLineMultianual />
                    </div>

                    <div className="pt-8">
                        <ChartBarLabelCustom />
                    </div>

                    <div className="pt-8 ">
                        <ChartPieRegional />
                    </div>

                    <div className="pt-8 ">
                        <ChartStateGroupedBar />
                    </div>
                </div>
            </div>
        </section>
    )
}