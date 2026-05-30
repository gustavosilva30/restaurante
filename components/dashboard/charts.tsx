"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Clock,
  Zap,
  BarChart3,
  Activity,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockDashboardData } from "@/lib/mock-data"

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { 
  active?: boolean
  payload?: Array<{ value: number; dataKey?: string; color?: string; name?: string }>
  label?: string 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-4 shadow-2xl">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="h-2.5 w-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-muted-foreground">{entry.name || entry.dataKey}:</span>
            <span className="font-semibold">
              {entry.dataKey?.includes("sales") || entry.dataKey?.includes("revenue") || entry.dataKey?.includes("value")
                ? `R$ ${entry.value.toLocaleString("pt-BR")}`
                : entry.value.toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Real-time sales chart with live updates simulation
export function RealTimeSalesChart() {
  const [data, setData] = React.useState(mockDashboardData.hourlyData)
  const [isLive, setIsLive] = React.useState(true)

  React.useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev]
        const lastIndex = newData.length - 1
        // Simulate live update
        newData[lastIndex] = {
          ...newData[lastIndex],
          sales: newData[lastIndex].sales + Math.floor(Math.random() * 100) - 30,
          orders: newData[lastIndex].orders + (Math.random() > 0.7 ? 1 : 0),
        }
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0)
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Vendas em Tempo Real
              </CardTitle>
              <CardDescription>Acompanhe o faturamento do dia</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  isLive ? "bg-emerald-500 animate-pulse" : "bg-muted"
                )} />
                <span className="text-xs text-muted-foreground">
                  {isLive ? "Ao vivo" : "Pausado"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("h-4 w-4", isLive && "animate-spin")} />
              </Button>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Vendas</p>
              <p className="text-2xl font-bold text-emerald-500">
                R$ {totalSales.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pedidos</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Ticket Médio</p>
              <p className="text-2xl font-bold">
                R$ {(totalSales / Math.max(totalOrders, 1)).toFixed(2)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="salesGradientLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={2500} yAxisId="left" stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "Meta", position: "right", fill: "#f59e0b", fontSize: 11 }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Vendas"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#salesGradientLive)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Pedidos"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Heatmap for peak hours
export function PeakHoursHeatmap() {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const hours = ["11h", "12h", "13h", "14h", "18h", "19h", "20h", "21h", "22h"]
  
  // Create grid data
  const gridData = React.useMemo(() => {
    const grid: { day: number; hour: number; intensity: number; orders: number }[][] = []
    
    for (let d = 0; d < 7; d++) {
      grid[d] = []
      for (let h = 0; h < hours.length; h++) {
        const hourValue = h < 4 ? 11 + h : 14 + h
        const found = mockDashboardData.peakHoursHeatmap.find(
          item => item.day === d && item.hour === hourValue
        )
        grid[d][h] = found || { day: d, hour: hourValue, intensity: 5, orders: 2 }
      }
    }
    return grid
  }, [])

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return "bg-emerald-500"
    if (intensity >= 60) return "bg-emerald-400"
    if (intensity >= 40) return "bg-emerald-300/70"
    if (intensity >= 20) return "bg-emerald-200/50"
    return "bg-muted/30"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Mapa de Calor - Horários de Pico
              </CardTitle>
              <CardDescription>Intensidade de pedidos por dia e horário</CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              Sáb 12h - Pico máximo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Hour labels */}
            <div className="flex gap-1 pl-12">
              {hours.map(hour => (
                <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                  {hour}
                </div>
              ))}
            </div>
            
            {/* Grid */}
            {gridData.map((row, dayIndex) => (
              <div key={dayIndex} className="flex items-center gap-1">
                <div className="w-10 text-xs text-muted-foreground text-right pr-2">
                  {days[dayIndex]}
                </div>
                {row.map((cell, hourIndex) => (
                  <motion.div
                    key={`${dayIndex}-${hourIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (dayIndex * hours.length + hourIndex) * 0.01 }}
                    className={cn(
                      "flex-1 h-8 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group relative",
                      getIntensityColor(cell.intensity)
                    )}
                    title={`${days[cell.day]} ${cell.hour}h - ${cell.orders} pedidos`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {cell.orders}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Menos</span>
              <div className="flex gap-1">
                {["bg-muted/30", "bg-emerald-200/50", "bg-emerald-300/70", "bg-emerald-400", "bg-emerald-500"].map((color, i) => (
                  <div key={i} className={cn("h-3 w-6 rounded", color)} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Mais</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Top products ranking with trend indicators
export function TopProductsChart() {
  const [period, setPeriod] = React.useState<"day" | "week" | "month">("day")
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Ranking de Produtos
              </CardTitle>
              <CardDescription>Produtos mais vendidos</CardDescription>
            </div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <TabsList className="h-8">
                <TabsTrigger value="day" className="text-xs px-2.5">Dia</TabsTrigger>
                <TabsTrigger value="week" className="text-xs px-2.5">Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-2.5">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDashboardData.topProducts.slice(0, 6).map((product, index) => {
              const maxQuantity = Math.max(...mockDashboardData.topProducts.map(p => p.quantity))
              const percentage = (product.quantity / maxQuantity) * 100
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                      index === 0 ? "bg-amber-500/20 text-amber-500" :
                      index === 1 ? "bg-zinc-400/20 text-zinc-400" :
                      index === 2 ? "bg-orange-600/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium truncate pr-2">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold">
                            {product.quantity}
                          </span>
                          <div className={cn(
                            "flex items-center gap-0.5 text-xs",
                            product.trend > 0 ? "text-emerald-500" : "text-red-500"
                          )}>
                            {product.trend > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(product.trend)}%
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            index === 0 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                            index === 1 ? "bg-gradient-to-r from-zinc-500 to-zinc-400" :
                            index === 2 ? "bg-gradient-to-r from-orange-600 to-orange-500" :
                            "bg-primary/60"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          R$ {product.revenue.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Revenue by category pie chart
export function RevenueByCategoryChart() {
  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Faturamento por Categoria
          </CardTitle>
          <CardDescription>Distribuição das vendas do dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockDashboardData.revenueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {mockDashboardData.revenueByCategory.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                        style={{ transition: "opacity 0.2s" }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {mockDashboardData.revenueByCategory.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg transition-colors",
                    activeIndex === index && "bg-muted/50"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">
                      R$ {category.value.toLocaleString("pt-BR")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.percentage}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Weekly comparison chart
export function WeeklyComparisonChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Comparativo Semanal</CardTitle>
              <CardDescription>Vendas vs Pedidos nos últimos 7 dias</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Vendas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="text-muted-foreground">Pedidos</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDashboardData.salesByDay} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="value"
                  name="Vendas (R$)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="Pedidos"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Payment methods chart
export function PaymentMethodsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
          <CardDescription>Distribuição dos pagamentos do dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDashboardData.paymentMethods.map((method, index) => (
              <motion.div
                key={method.method}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="text-sm font-medium">{method.method}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      R$ {method.value.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({method.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: method.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${method.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Export old chart names for backwards compatibility
export function SalesChart() {
  return <RealTimeSalesChart />
}

export function PeakHoursChart() {
  return <PeakHoursHeatmap />
}
