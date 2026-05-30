"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  ChefHat,
  Check,
  AlertTriangle,
  Truck,
  UtensilsCrossed,
  Timer,
  Bell,
  Play,
  Volume2,
  VolumeX,
  LayoutGrid,
  Columns,
  Sparkles,
  CheckCircle,
  Plus,
  Tv,
  Maximize2,
  Minimize2,
  Activity,
  Flame,
  Coffee,
  IceCream,
  Package,
  CheckSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockKitchenOrders } from "@/lib/mock-data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { integrationEventBus } from "@/services/integrations/integrations-engine"

type OrderStatus = "received" | "preparing" | "ready" | "delivered"
type Priority = "normal" | "high"
type Station = "all" | "chapa" | "montagem" | "bebidas" | "sobremesas" | "expedicao"

interface KitchenOrder {
  id: string
  table: number | null
  isDelivery?: boolean
  customerName?: string
  items: Array<{
    name: string
    quantity: number
    notes: string
    station: "chapa" | "montagem" | "bebidas" | "sobremesas"
  }>
  status: OrderStatus
  createdAt: Date
  priority: Priority
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; border: string; darkBg: string }> = {
  received: { label: "Fila de Espera", color: "text-blue-500", bgColor: "bg-blue-500", border: "border-blue-500/20", darkBg: "bg-blue-550/10" },
  preparing: { label: "Em Preparo", color: "text-amber-500", bgColor: "bg-amber-500", border: "border-amber-500/20", darkBg: "bg-amber-550/10" },
  ready: { label: "Pronto / Expedir", color: "text-emerald-500", bgColor: "bg-emerald-500", border: "border-emerald-500/20", darkBg: "bg-emerald-550/10" },
  delivered: { label: "Despachado", color: "text-muted-foreground", bgColor: "bg-muted-foreground", border: "border-transparent", darkBg: "bg-muted-foreground/10" },
}

// ----------------------------------------------------
// KITCHEN SOUND SYNTHESIZER (Web Audio API)
// ----------------------------------------------------
function playKitchenSound(type: "new_order" | "complete" | "alert" | "urgent", isMuted: boolean) {
  if (isMuted) return
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    if (type === "new_order") {
      // Crisp metallic kitchen bell chime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc1.type = "sine"
      osc1.frequency.setValueAtTime(987.77, ctx.currentTime) // B5 note
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(1479.98, ctx.currentTime) // F#6 note

      gainNode.gain.setValueAtTime(0.18, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.8)
      osc2.stop(ctx.currentTime + 0.8)
    } else if (type === "complete") {
      // Success double-tone
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
      osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.08) // A6

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } else if (type === "alert") {
      // Warning alarm chime
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(554.37, ctx.currentTime + 0.15)
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.3)

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.35)
    } else if (type === "urgent") {
      // High-pitched warning beep
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(987.77, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    }
  } catch (error) {
    console.error("Audio synthesis error:", error)
  }
}

// ----------------------------------------------------
// DYNAMIC SLA TIMER
// ----------------------------------------------------
interface TimerState {
  minutes: number
  seconds: number
  colorClass: string
  borderClass: string
  bgClass: string
  isOvertime: boolean
}

function useKitchenTimer(createdAt: Date): TimerState {
  const [secondsElapsed, setSecondsElapsed] = React.useState(0)

  React.useEffect(() => {
    const updateTime = () => {
      const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
      setSecondsElapsed(diff >= 0 ? diff : 0)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [createdAt])

  const minutes = Math.floor(secondsElapsed / 60)
  const seconds = secondsElapsed % 60

  let colorClass = "text-emerald-500 dark:text-emerald-400"
  let borderClass = "border-emerald-500/20"
  let bgClass = "bg-emerald-500/10 text-emerald-600"
  let isOvertime = false

  if (minutes >= 15) {
    colorClass = "text-red-500 dark:text-red-400 font-black animate-pulse"
    borderClass = "border-red-500/40"
    bgClass = "bg-red-500/15 text-red-500"
    isOvertime = true
  } else if (minutes >= 8) {
    colorClass = "text-amber-500 dark:text-amber-400 font-bold"
    borderClass = "border-amber-500/30"
    bgClass = "bg-amber-500/10 text-amber-600"
  }

  return { minutes, seconds, colorClass, borderClass, bgClass, isOvertime }
}

// Formatting critical keywords in notes
function formatNotes(notes: string) {
  if (!notes) return null
  const alertKeywords = ["sem", "não", "nao", "alergia", "alérgico", "alergenico", "glúten", "gluten", "lactose", "zero"]
  
  const tokens = notes.split(/(\s+)/)
  return tokens.map((token, idx) => {
    const lower = token.toLowerCase().replace(/[^a-zãõáéíóú]/g, "")
    const matches = alertKeywords.some(keyword => lower.includes(keyword))
    if (matches) {
      return (
        <span key={idx} className="text-red-500 dark:text-red-400 font-extrabold underline decoration-2">
          {token}
        </span>
      )
    }
    return <span key={idx}>{token}</span>
  })
}

export function KitchenContent() {
  const [orders, setOrders] = React.useState<KitchenOrder[]>([])
  const [activeStation, setActiveStation] = React.useState<Station>("all")
  const [filter, setFilter] = React.useState<OrderStatus | "all">("all")
  const [viewMode, setViewMode] = React.useState<"grid" | "kanban">("kanban")
  const [isMuted, setIsMuted] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // Seed initial orders staggeredly
  React.useEffect(() => {
    const defaultData: KitchenOrder[] = [
      {
        id: "ORD-9482",
        table: 8,
        priority: "normal",
        status: "received",
        createdAt: new Date(Date.now() - 3 * 60000), // 3 min ago
        items: [
          { name: "Burguer Artesanal Duplo", quantity: 2, notes: "Sem cebola", station: "chapa" },
          { name: "Batata Rústica Canoa", quantity: 1, notes: "Bacon bem torrado", station: "montagem" },
          { name: "Coca-Cola Lata Zero", quantity: 2, notes: "Enviar copo com gelo e limão", station: "bebidas" }
        ]
      },
      {
        id: "ORD-8472",
        table: null,
        isDelivery: true,
        customerName: "Lucas Silva",
        priority: "high",
        status: "preparing",
        createdAt: new Date(Date.now() - 11 * 60000), // 11 min ago (Amber timer)
        items: [
          { name: "Feijoada Executiva Premium", quantity: 1, notes: "Sem coentro", station: "chapa" },
          { name: "Mousse de Limão Trufado", quantity: 1, notes: "Sem glúten", station: "sobremesas" }
        ]
      },
      {
        id: "ORD-7294",
        table: 12,
        priority: "normal",
        status: "ready",
        createdAt: new Date(Date.now() - 18 * 60000), // 18 min ago (Red/Critical SLA timer)
        items: [
          { name: "Salada Caesar com Grelhado", quantity: 1, notes: "Molho à parte", station: "montagem" },
          { name: "Suco Natural de Laranja", quantity: 1, notes: "Sem açúcar", station: "bebidas" }
        ]
      }
    ]
    setOrders(defaultData)
  }, [])

  // Listen to the central Integration Event Bus for real-time order entries!
  React.useEffect(() => {
    const unsubscribe = integrationEventBus.subscribe("REALTIME_ORDER_CREATED", (order: any) => {
      // Map stations based on item names dynamically for Toast POS style routing!
      const itemsMapped = order.items.map((i: any) => {
        const nameLower = i.name.toLowerCase()
        let station: "chapa" | "montagem" | "bebidas" | "sobremesas" = "montagem"

        if (nameLower.includes("burguer") || nameLower.includes("chapa") || nameLower.includes("feijoada") || nameLower.includes("carne") || nameLower.includes("grelhado")) {
          station = "chapa"
        } else if (nameLower.includes("coca") || nameLower.includes("suco") || nameLower.includes("bebida") || nameLower.includes("refrigerante") || nameLower.includes("cerveja")) {
          station = "bebidas"
        } else if (nameLower.includes("mousse") || nameLower.includes("pudim") || nameLower.includes("sobremesa") || nameLower.includes("doce")) {
          station = "sobremesas"
        }

        return {
          name: i.name,
          quantity: i.quantity,
          notes: i.notes || "",
          station
        }
      })

      const mappedOrder: KitchenOrder = {
        id: order.id,
        table: order.table || null,
        isDelivery: order.customerName ? true : false,
        customerName: order.customerName,
        items: itemsMapped,
        status: "received",
        createdAt: new Date(order.createdAt || Date.now()),
        priority: "high"
      }

      setOrders(prev => {
        if (prev.some(o => o.id === mappedOrder.id)) return prev
        return [mappedOrder, ...prev]
      })
      playKitchenSound("new_order", isMuted)
    })
    return () => unsubscribe()
  }, [isMuted])

  // SLA Warnings and bottleneck analyzer (Kitchen Intelligence)
  const activePreparingCount = orders.filter(o => o.status === "preparing").length
  const chapaActiveCount = orders.filter(o => o.status === "preparing" && o.items.some(i => i.station === "chapa")).length
  const delayedOrdersCount = orders.filter(o => {
    if (o.status === "delivered") return false
    const diffMin = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000)
    return diffMin >= 15
  }).length

  // Sort orders prioritarily: High priority/urgent first, then oldest first
  const sortedAndFilteredOrders = (statusFilter: OrderStatus) => {
    return orders
      .filter(o => o.status === statusFilter)
      .filter(o => {
        // Estação filter
        if (activeStation === "all") return true
        if (activeStation === "expedicao") return o.status === "ready" // Expedition gets ready products
        return o.items.some(item => item.station === activeStation)
      })
      .sort((a, b) => {
        if (a.priority === "high" && b.priority !== "high") return -1
        if (b.priority === "high" && a.priority !== "high") return 1
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        if (newStatus === "ready") {
          playKitchenSound("complete", isMuted)
        }
        // Broadcast status to the central integration bus (sends WhatsApp alerts instantly)
        integrationEventBus.publish("KDS_STATUS_CHANGED", { orderId, status: newStatus })
        return { ...order, status: newStatus }
      }
      return order
    }))
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ["received", "preparing", "ready", "delivered"]
    const idx = flow.indexOf(currentStatus)
    if (idx < flow.length - 1) return flow[idx + 1]
    return null
  }

  // Simulate new order internally
  const simulateNewOrder = () => {
    const isDelivery = Math.random() > 0.4
    const names = ["Carlos Souza", "Guilherme Bastos", "Fernanda Limeira", "Juliana Mendes"]
    const possibleItems = [
      { name: "Burguer Artesanal Duplo", notes: "Sem cebola, bem passado", station: "chapa" as const },
      { name: "Feijoada Executiva Premium", notes: "Alergia a camarão", station: "chapa" as const },
      { name: "Batata Rústica Canoa", notes: "Com muito cheddar", station: "montagem" as const },
      { name: "Salada Caesar com Grelhado", notes: "Molho à parte", station: "montagem" as const },
      { name: "Coca-Cola Lata Zero", notes: "Gelo e limão", station: "bebidas" as const },
      { name: "Pudim Artesanal", notes: "Calda extra", station: "sobremesas" as const }
    ]

    const items = []
    const count = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < count; i++) {
      items.push(possibleItems[Math.floor(Math.random() * possibleItems.length)])
    }

    const newOrder: KitchenOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: isDelivery ? null : Math.floor(Math.random() * 15) + 1,
      isDelivery,
      customerName: isDelivery ? names[Math.floor(Math.random() * names.length)] : undefined,
      items,
      status: "received",
      createdAt: new Date(),
      priority: Math.random() > 0.7 ? "high" : "normal"
    }

    setOrders(prev => [newOrder, ...prev])
    playKitchenSound("new_order", isMuted)
  }

  // Total active count indicators
  const stats = {
    received: orders.filter(o => o.status === "received").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    total: orders.filter(o => o.status !== "delivered").length
  }

  return (
    <div 
      className={cn(
        "space-y-5 transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 bg-[#0f172a] text-[#f8fafc] p-6 overflow-y-auto w-full h-full"
      )}
    >
      {/* 1. KITCHEN TV VIEW HEADER PANEL - Professional Dashboard Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.06] rounded-2xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <ChefHat className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              KDS - Central de Produção Culinária
              {isFullscreen && <Badge className="bg-red-500 text-white font-extrabold text-[8px] animate-pulse">MODO TV ATIVO</Badge>}
            </h2>
            <p className="text-[9px] text-slate-500 dark:text-[#94a3b8] font-bold uppercase tracking-wider">Toast POS Industrial Display System</p>
          </div>
        </div>

        {/* Estações & TV Fullscreen Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sounds Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-xl border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#1e293b]/40 font-bold text-xs h-9 transition-colors"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 mr-1.5 text-red-500 animate-pulse" />
                Mudo
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-1.5 text-emerald-500" />
                Sons Ativos
              </>
            )}
          </Button>

          {/* Simulate new order */}
          <Button
            onClick={simulateNewOrder}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-[#6366f1] text-white font-bold text-xs h-9 shadow-md shadow-indigo-600/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Ticket
          </Button>

          {/* TV Fullscreen toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#1e293b]/40 font-bold text-xs h-9 transition-colors flex items-center gap-1.5"
            title="Ativar Modo TV"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4 text-amber-500" />
                <span>Sair Fullscreen</span>
              </>
            ) : (
              <>
                <Tv className="h-4 w-4 text-[#6366f1]" />
                <span>Modo TV (Fullscreen)</span>
              </>
            )}
          </Button>

          {/* Kanban / Grid switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#1e293b]/40 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
                viewMode === "kanban" ? "bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-white shadow-sm" : "text-slate-550 dark:text-[#94a3b8]"
              )}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
                viewMode === "grid" ? "bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-white shadow-sm" : "text-slate-550 dark:text-[#94a3b8]"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grade</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ESTAÇÕES FILTERING TABS (TOAST POS STYLE BAR) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-white/[0.06] p-1.5 rounded-2xl transition-colors">
        {[
          { id: "all", label: "Todas as Estações", icon: ChefHat },
          { id: "chapa", label: "Chapa 🔥", icon: Flame },
          { id: "montagem", label: "Montagem 🍔", icon: CheckSquare },
          { id: "bebidas", label: "Bebidas 🥤", icon: Coffee },
          { id: "sobremesas", label: "Sobremesas 🍰", icon: IceCream },
          { id: "expedicao", label: "Expedição 📦", icon: Package }
        ].map((station) => (
          <button
            key={station.id}
            onClick={() => setActiveStation(station.id as Station)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border border-transparent",
              activeStation === station.id 
                ? "bg-white dark:bg-[#1e293b] text-[#6366f1] dark:text-white shadow border-slate-200 dark:border-white/[0.08]" 
                : "text-slate-500 dark:text-[#94a3b8] hover:bg-white/50 dark:hover:bg-[#1e293b]/20"
            )}
          >
            <station.icon className="h-4 w-4 shrink-0" />
            <span>{station.label}</span>
          </button>
        ))}
      </div>

      {/* 3. KITCHEN INTELLIGENCE & METRICS BAR (OBSERVABILITY FEED) */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4 select-none shrink-0">
        {/* IA Bottleneck Analyzer Alert */}
        <div className="lg:col-span-2 p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.06] rounded-2xl flex items-center justify-between gap-3 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 animate-pulse">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-black uppercase text-red-500 tracking-widest block">KITCHEN INTELLIGENCE DIAGNOSTIC</span>
              <p className="text-[10.5px] font-extrabold text-slate-800 dark:text-slate-300 truncate leading-snug">
                {chapaActiveCount >= 2 ? (
                  "⚠️ Estação Chapa Sobrecargada (Preparo +34% acima da média)"
                ) : delayedOrdersCount > 0 ? (
                  `⚠️ Gargalo Operacional: ${delayedOrdersCount} ticket(s) atrasando SLA`
                ) : (
                  "🟢 Fila Limpa: SLA da cozinha excelente (Tempo médio: 8.5 min)"
                )}
              </p>
            </div>
          </div>
          <Badge className="bg-slate-100 dark:bg-[#1e293b] text-slate-500 dark:text-slate-400 border-none text-[8.5px] font-bold py-0.5 px-2">
            IA Monitor On
          </Badge>
        </div>

        {/* SLA Medio indicator */}
        <div className="p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.06] rounded-2xl flex items-center justify-between gap-3 transition-all">
          <div>
            <span className="text-[8px] font-black uppercase text-[#94a3b8] block">SLA Médio Cozinha</span>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5 flex items-center gap-1">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              11.2 min
            </p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-bold rounded-lg h-5 px-1.5 flex items-center">
            Adequado
          </Badge>
        </div>

        {/* Tickets atrasados */}
        <div className="p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.06] rounded-2xl flex items-center justify-between gap-3 transition-all">
          <div>
            <span className="text-[8px] font-black uppercase text-[#94a3b8] block">Tickets Atrasando</span>
            <p className="text-xl font-black mt-0.5 flex items-center gap-1 text-slate-800 dark:text-white">
              <AlertTriangle className={cn("h-4.5 w-4.5", delayedOrdersCount > 0 ? "text-red-500 animate-bounce" : "text-slate-400")} />
              {delayedOrdersCount} ativo(s)
            </p>
          </div>
          <Badge className={cn("border-none text-[8px] font-bold rounded-lg h-5 px-1.5 flex items-center", delayedOrdersCount > 0 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-slate-100 dark:bg-[#1e293b] text-slate-500")}>
            {delayedOrdersCount > 0 ? "Crítico" : "Normal"}
          </Badge>
        </div>
      </div>

      {/* 4. MAIN KDS MONITOR BOARD */}
      <AnimatePresence mode="wait">
        {viewMode === "kanban" ? (
          /* Kanban Swimlanes Mode */
          <motion.div
            key="kds-kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* COLUMN 1: RECEIVED */}
            <div className="bg-slate-100/60 dark:bg-[#111827]/40 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-3.5 flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#6366f1] text-white font-extrabold text-xs h-6 w-6 rounded-full flex items-center justify-center">{stats.received}</Badge>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Fila de Entrada</h3>
                </div>
                <Bell className="h-4.5 w-4.5 text-[#6366f1] animate-pulse" />
              </div>

              <ScrollArea className="flex-1 max-h-[450px]">
                <div className="space-y-4 pr-1">
                  <AnimatePresence mode="popLayout">
                    {sortedAndFilteredOrders("received").map((order, idx) => (
                      <KDSOrderCard
                        key={order.id}
                        order={order}
                        updateStatus={updateOrderStatus}
                        getNextStatus={getNextStatus}
                      />
                    ))}
                  </AnimatePresence>
                  {stats.received === 0 && (
                    <div className="text-center py-20 text-[#94a3b8] text-xs font-bold uppercase tracking-wider opacity-60">
                      Sem tickets na fila
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* COLUMN 2: PREPARING */}
            <div className="bg-slate-100/60 dark:bg-[#111827]/40 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-3.5 flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white font-extrabold text-xs h-6 w-6 rounded-full flex items-center justify-center">{stats.preparing}</Badge>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Em Preparação</h3>
                </div>
                <Timer className="h-4.5 w-4.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              <ScrollArea className="flex-1 max-h-[450px]">
                <div className="space-y-4 pr-1">
                  <AnimatePresence mode="popLayout">
                    {sortedAndFilteredOrders("preparing").map((order, idx) => (
                      <KDSOrderCard
                        key={order.id}
                        order={order}
                        updateStatus={updateOrderStatus}
                        getNextStatus={getNextStatus}
                      />
                    ))}
                  </AnimatePresence>
                  {stats.preparing === 0 && (
                    <div className="text-center py-20 text-[#94a3b8] text-xs font-bold uppercase tracking-wider opacity-60">
                      Cozinha ociosa. Aguardando...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* COLUMN 3: READY */}
            <div className="bg-slate-100/60 dark:bg-[#111827]/40 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-3.5 flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white font-extrabold text-xs h-6 w-6 rounded-full flex items-center justify-center">{stats.ready}</Badge>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Pronto para Expedir</h3>
                </div>
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
              </div>

              <ScrollArea className="flex-1 max-h-[450px]">
                <div className="space-y-4 pr-1">
                  <AnimatePresence mode="popLayout">
                    {sortedAndFilteredOrders("ready").map((order, idx) => (
                      <KDSOrderCard
                        key={order.id}
                        order={order}
                        updateStatus={updateOrderStatus}
                        getNextStatus={getNextStatus}
                      />
                    ))}
                  </AnimatePresence>
                  {stats.ready === 0 && (
                    <div className="text-center py-20 text-[#94a3b8] text-xs font-bold uppercase tracking-wider opacity-60">
                      Sem tickets prontos
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

          </motion.div>
        ) : (
          /* consolidated GRID VIEW */
          <motion.div
            key="kds-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {orders
              .filter(o => filter === "all" || o.status === filter)
              .filter(o => o.status !== "delivered")
              .map((order, idx) => (
                <KDSOrderCard
                  key={order.id}
                  order={order}
                  updateStatus={updateOrderStatus}
                  getNextStatus={getNextStatus}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ----------------------------------------------------
// TICKET COMPONENT - TOAST POS / RECEIPT STYLING
// ----------------------------------------------------
interface KDSOrderCardProps {
  order: KitchenOrder
  updateStatus: (orderId: string, newStatus: OrderStatus) => void
  getNextStatus: (currentStatus: OrderStatus) => OrderStatus | null
}

function KDSOrderCard({ order, updateStatus, getNextStatus }: KDSOrderCardProps) {
  const config = statusConfig[order.status]
  const nextStatus = getNextStatus(order.status)
  
  // Custom Hook for precise ticking SLA timing and visual alarms
  const { minutes, seconds, colorClass, borderClass, bgClass, isOvertime } = useKitchenTimer(order.createdAt)

  // Consolidate repeating items for industrial density (e.g. 2x Coca instead of separate lines)
  const consolidatedItems = React.useMemo(() => {
    const map: Record<string, { name: string; quantity: number; notes: string; station: string }> = {}
    order.items.forEach(item => {
      const key = `${item.name}-${item.notes}`
      if (map[key]) {
        map[key].quantity += item.quantity
      } else {
        map[key] = { ...item }
      }
    })
    return Object.values(map)
  }, [order.items])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="w-full shrink-0"
    >
      <Card
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-white dark:bg-[#1e293b] shadow transition-all duration-200",
          borderClass,
          isOvertime && "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-[#0f172a]"
        )}
      >
        {/* Top colorful bar */}
        <div className={cn("h-1.5 w-full", config.bgColor)} />

        {/* Hazard warning diagonal stripes for highly critical overtime tickets (SLA exceeded) */}
        {isOvertime && (
          <div 
            className="h-2 w-full bg-red-500"
            style={{
              backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)",
              backgroundSize: "12px 12px"
            }}
          />
        )}

        {/* Ticket Header styled like real thermal receipt paper */}
        <CardHeader className="pb-2.5 pt-3.5 px-4 bg-slate-50/80 dark:bg-[#111827]/40 border-b border-slate-200 dark:border-white/[0.06] relative">
          
          <div className="flex items-center justify-between gap-1.5">
            <CardTitle className="flex items-center gap-1.5 text-xs font-black">
              {order.isDelivery ? (
                <>
                  <Truck className="h-4 w-4 text-[#6366f1] shrink-0" />
                  <span className="text-slate-800 dark:text-[#f8fafc] truncate max-w-[120px] tracking-wide">
                    {order.id}
                  </span>
                </>
              ) : (
                <>
                  <UtensilsCrossed className="h-4 w-4 text-rose-500 shrink-0" />
                  <span className="text-slate-900 dark:text-white font-black tracking-wide">
                    Mesa {order.table}
                  </span>
                </>
              )}
            </CardTitle>
            
            {/* Live Ticking SLA timer */}
            <div className={cn("flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-mono text-[10.5px] font-black border", borderClass, bgClass)}>
              <Clock className={cn("h-3.5 w-3.5 shrink-0", isOvertime && "animate-spin")} />
              <span>
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Delivery target / Marketplace badges */}
          {order.customerName && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Badge className="bg-[#6366f1]/10 text-[#6366f1] border-none text-[8px] font-bold px-1 py-0 h-4">iFood</Badge>
              <span className="text-[9px] text-[#94a3b8] font-bold uppercase truncate tracking-wide flex-1 block">
                {order.customerName}
              </span>
            </div>
          )}
        </CardHeader>

        {/* Compact high density items list */}
        <CardContent className="p-3 space-y-3.5 bg-white dark:bg-[#1e293b]/30">
          <div className="space-y-2">
            {consolidatedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-[#111827]/40 border border-slate-200 dark:border-white/[0.04] rounded-xl text-xs font-semibold"
              >
                {/* Quantity multiplier box */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-[10.5px] shadow-sm">
                  {item.quantity}x
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-extrabold text-[11px] text-slate-800 dark:text-[#f8fafc] tracking-tight leading-snug truncate">
                      {item.name}
                    </p>
                    <Badge className="bg-slate-200 dark:bg-[#1e293b] text-slate-500 dark:text-slate-400 border-none text-[7.5px] font-bold px-1 py-0 h-3.5 shrink-0 uppercase">
                      {item.station}
                    </Badge>
                  </div>

                  {item.notes && (
                    <p className="text-[9px] text-[#94a3b8] font-bold leading-normal mt-1 flex items-center gap-0.5">
                      💡 <span>{formatNotes(item.notes)}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ticket bottom properties */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.04]">
            <Badge className={cn("text-[8px] font-extrabold uppercase px-1.5 h-4.5 border-none", bgClass)}>
              {config.label}
            </Badge>

            {isOvertime && (
              <Badge variant="destructive" className="gap-1 text-[8px] font-bold animate-pulse px-1.5 h-4.5 border-none bg-red-600 text-white">
                <AlertTriangle className="h-2.5 w-2.5" />
                Atrasado
              </Badge>
            )}
          </div>

          {/* Touch-optimized single tap status progression button */}
          {nextStatus && (
            <Button
              onClick={() => updateStatus(order.id, nextStatus)}
              className={cn(
                "w-full rounded-xl h-9.5 text-[10.5px] font-black shadow-sm tracking-wide select-none active:scale-[0.96] border-0 transition-all duration-200 flex items-center justify-center gap-1.5 mt-1",
                order.status === "ready" 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-600/10" 
                  : "bg-slate-100 hover:bg-[#6366f1] dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white dark:hover:bg-[#6366f1]"
              )}
            >
              {order.status === "received" && (
                <>
                  <ChefHat className="h-4 w-4 shrink-0" />
                  Iniciar Preparo
                </>
              )}
              {order.status === "preparing" && (
                <>
                  <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                  Marcar Pronto
                </>
              )}
              {order.status === "ready" && (
                <>
                  <Truck className="h-4 w-4 shrink-0" />
                  Despachar Ticket
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
