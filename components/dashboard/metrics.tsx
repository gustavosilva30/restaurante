"use client"

import * as React from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import {
  DollarSign,
  ShoppingBag,
  UtensilsCrossed,
  TrendingUp,
  Truck,
  ChefHat,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { mockDashboardData } from "@/lib/mock-data"

// Animated counter component
function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }: { 
  value: number
  decimals?: number
  prefix?: string
  suffix?: string 
}) {
  const spring = useSpring(0, { stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) => 
    `${prefix}${current.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  )

  React.useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

interface MetricCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  change?: number
  changeLabel?: string
  icon: React.ElementType
  iconColor: string
  bgGradient: string
  delay?: number
  sparkline?: number[]
}

function MetricCard({
  title,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  bgGradient,
  delay = 0,
  sparkline,
}: MetricCardProps) {
  const isPositive = change && change > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          bgGradient
        )} />
        
        {/* Sparkline background */}
        {sparkline && (
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0 40 ${sparkline.map((v, i) => `L ${(i / (sparkline.length - 1)) * 100} ${40 - (v / Math.max(...sparkline)) * 35}`).join(" ")} L 100 40 Z`}
                fill={`url(#sparkline-${title})`}
                className={iconColor}
              />
              <path
                d={`M 0 ${40 - (sparkline[0] / Math.max(...sparkline)) * 35} ${sparkline.map((v, i) => `L ${(i / (sparkline.length - 1)) * 100} ${40 - (v / Math.max(...sparkline)) * 35}`).join(" ")}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={iconColor}
              />
            </svg>
          </div>
        )}

        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {title}
              </p>
              <div className="text-3xl font-bold tracking-tight">
                <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
              </div>
              {change !== undefined && (
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold",
                    isPositive 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-red-500/10 text-red-500"
                  )}>
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {isPositive ? "+" : ""}{change}%
                  </div>
                  {changeLabel && (
                    <span className="text-xs text-muted-foreground">
                      {changeLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
              iconColor.replace("text-", "bg-").replace("500", "500/10")
            )}>
              <Icon className={cn("h-6 w-6", iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// AI Insight Card
function AIInsightCard() {
  const { predictions } = mockDashboardData

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        <CardContent className="relative p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Insights IA</p>
              <p className="text-xs text-muted-foreground">Previsão para hoje</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Faturamento previsto</span>
              <span className="text-sm font-bold text-primary">
                R$ {predictions.expectedRevenue.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Clientes esperados</span>
              <span className="text-sm font-bold">{predictions.expectedCustomers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Horário de pico</span>
              <span className="text-sm font-bold">{predictions.peakHourToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confiança</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${predictions.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">{predictions.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                predictions.trend === "alta" ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <span className="text-xs text-muted-foreground">
                Tendência de <span className="font-semibold text-foreground">{predictions.trend}</span> para o dia
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const metrics = [
  {
    title: "Vendas do Dia",
    value: mockDashboardData.salesOfDay,
    prefix: "R$ ",
    decimals: 2,
    change: 12.5,
    changeLabel: "vs ontem",
    icon: DollarSign,
    iconColor: "text-emerald-500",
    bgGradient: "bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent",
    sparkline: [65, 78, 52, 90, 85, 95, 100],
  },
  {
    title: "Pedidos Ativos",
    value: mockDashboardData.activeOrders,
    change: 8,
    changeLabel: "vs média",
    icon: ShoppingBag,
    iconColor: "text-blue-500",
    bgGradient: "bg-gradient-to-br from-blue-500/10 via-transparent to-transparent",
    sparkline: [20, 25, 18, 30, 22, 28, 23],
  },
  {
    title: "Mesas Ocupadas",
    value: mockDashboardData.occupiedTables,
    suffix: ` / ${mockDashboardData.totalTables}`,
    change: -5,
    changeLabel: "vs semana",
    icon: UtensilsCrossed,
    iconColor: "text-amber-500",
    bgGradient: "bg-gradient-to-br from-amber-500/10 via-transparent to-transparent",
    sparkline: [12, 15, 10, 18, 14, 16, 12],
  },
  {
    title: "Ticket Médio",
    value: mockDashboardData.averageTicket,
    prefix: "R$ ",
    decimals: 2,
    change: 5.3,
    changeLabel: "vs média",
    icon: Target,
    iconColor: "text-indigo-500",
    bgGradient: "bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent",
    sparkline: [55, 62, 58, 70, 65, 72, 68],
  },
  {
    title: "Clientes Hoje",
    value: mockDashboardData.customersToday,
    change: 15,
    changeLabel: "vs ontem",
    icon: Users,
    iconColor: "text-pink-500",
    bgGradient: "bg-gradient-to-br from-pink-500/10 via-transparent to-transparent",
    sparkline: [120, 145, 130, 165, 155, 180, 182],
  },
  {
    title: "Delivery",
    value: mockDashboardData.deliveryOrders,
    change: 22,
    changeLabel: "vs ontem",
    icon: Truck,
    iconColor: "text-orange-500",
    bgGradient: "bg-gradient-to-br from-orange-500/10 via-transparent to-transparent",
    sparkline: [10, 15, 12, 20, 16, 22, 18],
  },
  {
    title: "Produção",
    value: mockDashboardData.kitchenProduction,
    suffix: " itens",
    change: 10,
    changeLabel: "hoje",
    icon: ChefHat,
    iconColor: "text-rose-500",
    bgGradient: "bg-gradient-to-br from-rose-500/10 via-transparent to-transparent",
    sparkline: [100, 120, 110, 145, 135, 160, 156],
  },
  {
    title: "Faturamento",
    value: mockDashboardData.revenue,
    prefix: "R$ ",
    decimals: 2,
    change: 18.9,
    changeLabel: "este mês",
    icon: TrendingUp,
    iconColor: "text-cyan-500",
    bgGradient: "bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent",
    sparkline: [30000, 35000, 32000, 40000, 38000, 45000, 45780],
  },
]

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {metrics.slice(0, 4).map((metric, index) => (
        <MetricCard key={metric.title} {...metric} delay={index * 0.05} />
      ))}
      <AIInsightCard />
      {metrics.slice(4).map((metric, index) => (
        <MetricCard key={metric.title} {...metric} delay={(index + 5) * 0.05} />
      ))}
    </div>
  )
}
