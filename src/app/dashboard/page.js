'use client'

import { CardDashboard } from "../_components/cardDashboard";
import { HeaderDashboard } from "../_components/headerDashboard";
import { SideBar } from "../_components/sideBar";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { ChartArea } from "../_components/chartArea";
import { ChartPieRegional } from "../_components/chartPie";
import { Sigma, Newspaper } from "lucide-react";
import { ChartLineMultianual } from "../_components/chartBar";
import { ChartBarLabelCustom } from "../_components/chartBarHorizontal";
import { ChartStateGroupedBar } from "../_components/chartBarr";


export default function Dashboard() {
    return (
        <section className="bg-blue-950">
            <HeaderDashboard/>
            <div className="mx-40 mt-20">
               

                <div className="w-full">
                    <CardDashboard/>
                </div>

                <div className="pt-8">
                    <ChartArea/>
                </div>

                <div className="pt-8">
                    <ChartLineMultianual/>
                </div>

                <div className="pt-8">
                    <ChartBarLabelCustom/>
                </div>

                <div className="pt-8 ">
                    <ChartPieRegional/>
                </div>

                <div className="pt-8 ">
                    <ChartStateGroupedBar/>
                </div>
            </div>
        </section>
    )
}