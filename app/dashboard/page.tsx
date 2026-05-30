"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { DashboardMetrics } from "@/components/dashboard/metrics"
import { 
  RealTimeSalesChart, 
  PeakHoursHeatmap, 
  TopProductsChart,
  RevenueByCategoryChart,
  WeeklyComparisonChart,
  PaymentMethodsChart,
} from "@/components/dashboard/charts"
import { 
  LiveOrdersFeed, 
  TablesMapMini, 
  GoalsProgress,
  StaffRanking,
} from "@/components/dashboard/widgets"
import { AIInsightsWidget } from "@/components/dashboard/ai-insights"
import { motion } from "framer-motion"

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bom dia, Administrador</h1>
            <p className="text-muted-foreground">
              Aqui está o resumo do seu restaurante hoje
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
            <p className="text-lg font-semibold font-mono">
              {new Date().toLocaleTimeString("pt-BR", { 
                hour: "2-digit", 
                minute: "2-digit" 
              })}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <DashboardMetrics />

        {/* AI Intelligence Panel */}
        <AIInsightsWidget />

        {/* Main Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RealTimeSalesChart />
          </div>
          <TopProductsChart />
        </div>

        {/* Secondary Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PeakHoursHeatmap />
          </div>
          <RevenueByCategoryChart />
        </div>

        {/* Third Row */}
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <WeeklyComparisonChart />
          </div>
          <LiveOrdersFeed />
          <TablesMapMini />
        </div>

        {/* Fourth Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <PaymentMethodsChart />
          <GoalsProgress />
          <StaffRanking />
        </div>
      </motion.div>
    </AppLayout>
  )
}
