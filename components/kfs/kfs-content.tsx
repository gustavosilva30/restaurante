"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  Check,
  AlertTriangle,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  Tv,
  TrendingUp,
  BarChart3,
  Utensils,
  Bell,
  Zap,
  Coffee,
  XCircle,
  CheckCircle2,
  Inbox,
  ChefHat,
  ChevronRight,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

// Audio synthesis function for KFS sounds (purely Web Audio API)
function playKfsSound(type: "new_order" | "success" | "alarm" | "click", isMuted: boolean) {
  if (isMuted) return
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    if (type === "new_order") {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc1.type = "sine"
      osc1.frequency.setValueAtTime(880, ctx.currentTime) // A5
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(1318.51, ctx.currentTime) // E6

      gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 1.0)
      osc2.stop(ctx.currentTime + 1.0)
    } else if (type === "success") {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1) // G5

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } else if (type === "click") {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(300, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } else if (type === "alarm") {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(987.77, ctx.currentTime) // B5

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    }
  } catch (e) {
    console.warn("Audio Context failed to start (interaction required).")
  }
}

// Interfaces
type KfsStatus = "new" | "preparing" | "ready" | "delivered"
type OrderOrigin = "mesa" | "delivery" | "ifood" | "takeaway"

interface KfsOrder {
  id: string
  identifier: string // Mesa 12, Pedido #1847, etc.
  origin: OrderOrigin
  priority: "normal" | "high" | "vip"
  createdAt: Date
  items: Array<{
    name: string
    quantity: number
    notes?: string
  }>
  status: KfsStatus
  waiterNotified?: boolean
  estimatedTime?: number // Estimated prep time in minutes (e.g. 15)
}

// Initial mock state
const initialOrders: KfsOrder[] = [
  {
    id: "KFS-101",
    identifier: "Mesa 12",
    origin: "mesa",
    priority: "vip",
    createdAt: new Date(Date.now() - 4 * 60 * 1000), // 4 min ago
    items: [
      { name: "Marmita P", quantity: 2, notes: "Sem cebola" },
      { name: "Coca-Cola Zero", quantity: 1 }
    ],
    status: "new"
  },
  {
    id: "KFS-102",
    identifier: "Mesa 5",
    origin: "mesa",
    priority: "high",
    createdAt: new Date(Date.now() - 14 * 60 * 1000), // 14 min ago
    items: [
      { name: "Picanha Executiva", quantity: 2, notes: "Carne ao ponto para mal" },
      { name: "Suco de Laranja 500ml", quantity: 2 }
    ],
    status: "preparing",
    estimatedTime: 15
  },
  {
    id: "KFS-103",
    identifier: "Pedido #1084",
    origin: "ifood",
    priority: "high",
    createdAt: new Date(Date.now() - 18 * 60 * 1000), // 18 min ago (Delayed!)
    items: [
      { name: "Marmita P", quantity: 4, notes: "Mandar talheres descartáveis" },
      { name: "Guaraná Antarctica Lata", quantity: 3 }
    ],
    status: "new"
  },
  {
    id: "KFS-104",
    identifier: "Mesa 2",
    origin: "mesa",
    priority: "normal",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    items: [
      { name: "Hambúrguer Gourmet", quantity: 1, notes: "Sem maionese" },
      { name: "Batata Frita Porção", quantity: 1 }
    ],
    status: "new"
  },
  {
    id: "KFS-105",
    identifier: "Mesa 19",
    origin: "takeaway",
    priority: "normal",
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    items: [
      { name: "Marmita G", quantity: 1, notes: "Molho extra de pimenta" }
    ],
    status: "ready"
  }
]

export function KfsContent() {
  const [orders, setOrders] = React.useState<KfsOrder[]>(initialOrders)
  const [activeTab, setActiveTab] = React.useState<"cozinha" | "salao" | "analytics">("cozinha")
  const [isMuted, setIsMuted] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [toasts, setToasts] = React.useState<Array<{ id: string; message: string }>>([])
  
  // State for the click-to-view modal detailing order info & actioning status
  const [selectedOrder, setSelectedOrder] = React.useState<KfsOrder | null>(null)

  // Real-time ticking for state rerendering of timestamps
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto trigger warnings for delayed items
  React.useEffect(() => {
    const delayedCount = orders.filter(
      o => o.status !== "delivered" && (Date.now() - o.createdAt.getTime()) > 15 * 60000
    ).length
    if (delayedCount > 0 && tick % 15 === 0) {
      playKfsSound("alarm", isMuted)
    }
  }, [tick, orders, isMuted])

  const showToast = (message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }

  // Simulate new order arrival
  const simulateNewOrder = () => {
    playKfsSound("new_order", isMuted)
    const tables = [3, 7, 10, 15, 21]
    const selectedTable = tables[Math.floor(Math.random() * tables.length)]
    const newOrd: KfsOrder = {
      id: `KFS-${Date.now().toString().slice(-3)}`,
      identifier: Math.random() > 0.4 ? `Mesa ${selectedTable}` : `Pedido #${Math.floor(1000 + Math.random() * 9000)}`,
      origin: Math.random() > 0.6 ? "ifood" : Math.random() > 0.4 ? "delivery" : "mesa",
      priority: Math.random() > 0.8 ? "vip" : Math.random() > 0.5 ? "high" : "normal",
      createdAt: new Date(),
      items: [
        { name: "Marmita P", quantity: Math.floor(1 + Math.random() * 3) },
        { name: "Coca-Cola Zero", quantity: Math.floor(1 + Math.random() * 2), notes: "Gelada" }
      ],
      status: "new"
    }
    setOrders(prev => [newOrd, ...prev])
    showToast(`🔔 Novo pedido recebido: ${newOrd.identifier}!`)
  }

  // Change status workflow with custom presets
  const changeStatus = (id: string, nextStatus: KfsStatus) => {
    playKfsSound("click", isMuted)
    setOrders(prev =>
      prev.map(o => {
        if (o.id === id) {
          // If starting preparation, add preset time (15 mins)
          if (nextStatus === "preparing") {
            showToast(`🔥 Preparo iniciado para ${o.identifier}. Tempo estimado: 15 minutos.`)
            const updated = { ...o, status: nextStatus, estimatedTime: 15 }
            if (selectedOrder?.id === id) setSelectedOrder(updated)
            return updated
          }
          // If ready, notify salon
          if (nextStatus === "ready") {
            playKfsSound("success", isMuted)
            showToast(`🍽️ ${o.identifier} está CONCLUÍDO! Aguardando levar à mesa.`)
            const updated = { ...o, status: nextStatus, waiterNotified: true }
            if (selectedOrder?.id === id) setSelectedOrder(updated)
            return updated
          }
          // If delivered
          if (nextStatus === "delivered") {
            showToast(`✅ ${o.identifier} entregue/despachado.`)
            const updated = { ...o, status: nextStatus }
            if (selectedOrder?.id === id) setSelectedOrder(null) // close modal
            return updated
          }
          return { ...o, status: nextStatus }
        }
        return o
      })
    )
  }

  // Calculate order SLA details
  const getSlaInfo = (createdAt: Date) => {
    const elapsedSec = Math.floor((Date.now() - createdAt.getTime()) / 1000)
    const minutes = Math.floor(elapsedSec / 60)
    const seconds = elapsedSec % 60
    const timeText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    let color = "text-emerald-500 dark:text-emerald-400"
    let bg = "bg-emerald-500/[0.04] dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
    let status: "ok" | "warning" | "danger" = "ok"

    if (minutes >= 15) {
      color = "text-red-500 dark:text-red-400 font-extrabold animate-pulse"
      bg = "bg-red-500/[0.04] dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
      status = "danger"
    } else if (minutes >= 8) {
      color = "text-amber-500 dark:text-amber-400"
      bg = "bg-amber-500/[0.04] dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
      status = "warning"
    }

    return { timeText, color, bg, status, minutes }
  }

  // Helpers for Analytics
  const totalCompleted = orders.filter(o => o.status === "delivered").length
  const totalActive = orders.filter(o => o.status !== "delivered").length
  const averagePrepTime = Math.round(
    orders.length > 0 ? 8 + (orders.filter(o => o.status === "delivered").length * 0.5) : 8
  )
  const totalDelayed = orders.filter(o => {
    if (o.status === "delivered") return false
    const { minutes } = getSlaInfo(o.createdAt)
    return minutes >= 15
  }).length

  return (
    <div
      className={cn(
        "flex flex-col gap-5 w-full transition-all duration-300",
        "bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100",
        isFullscreen ? "fixed inset-0 z-50 p-5 overflow-y-auto" : "relative"
      )}
      style={{ minHeight: isFullscreen ? "100vh" : "auto" }}
    >
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.04] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Kitchen Flow System <Badge variant="outline" className="text-[9px] text-indigo-500 dark:text-indigo-400 border-indigo-500/20 font-bold px-1.5 py-0.5">KFS</Badge>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Central simplificada com cards de alta densidade e painel de controle por toque.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Simulation & Trigger Panel */}
          <Button
            onClick={simulateNewOrder}
            variant="outline"
            className="h-8 gap-1.5 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-500/10 text-xs font-bold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simular Pedido</span>
          </Button>

          {/* Mute button */}
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="outline"
            size="icon"
            className="h-8 w-8 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.03]"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4 text-emerald-550" />}
          </Button>

          {/* Fullscreen TV mode */}
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
            className="h-8 gap-1.5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.03] text-xs font-semibold"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-amber-500" />
                <span>Janela</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-indigo-550" />
                <span>Fullscreen TV</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl max-w-md border border-slate-200/55 dark:border-white/[0.04]">
        <button
          onClick={() => { playKfsSound("click", isMuted); setActiveTab("cozinha"); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
            activeTab === "cozinha"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/[0.02]"
          )}
        >
          <ChefHat className="h-3.5 w-3.5" />
          <span>COZINHA (KDS)</span>
        </button>

        <button
          onClick={() => { playKfsSound("click", isMuted); setActiveTab("salao"); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all relative",
            activeTab === "salao"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/[0.02]"
          )}
        >
          <Utensils className="h-3.5 w-3.5" />
          <span>SALÃO</span>
          {orders.filter(o => o.status === "ready").length > 0 && (
            <span className="absolute top-1.5 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => { playKfsSound("click", isMuted); setActiveTab("analytics"); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
            activeTab === "analytics"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/[0.02]"
          )}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>PAINEL EXPEDIÇÃO</span>
        </button>
      </div>

      {/* SLA Alert banner */}
      <AnimatePresence>
        {totalDelayed > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-800 dark:text-red-200 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 animate-pulse" />
              <span>
                <strong>⚠️ URGENTE:</strong> {totalDelayed} comandas estouraram a meta de SLA (&gt;15 min). Priorizar preparo!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content grid */}
      <div className="flex-1 w-full">
        {/* Tab 1: ULTRA-COMPACT KDS COZINHA */}
        {activeTab === "cozinha" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full items-start">
            
            {/* Column 1: PENDENTES (Novos) */}
            <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-xl border border-slate-200/70 dark:border-white/[0.03]">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.04] pb-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="font-extrabold text-xs tracking-wider text-slate-600 dark:text-slate-300 uppercase">1. Pendentes</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-[10px] font-bold">
                  {orders.filter(o => o.status === "new").length}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 min-h-[450px]">
                {orders.filter(o => o.status === "new").map(order => (
                  <CompactOrderCard
                    key={order.id}
                    order={order}
                    getSlaInfo={getSlaInfo}
                    onOpenDetails={() => { playKfsSound("click", isMuted); setSelectedOrder(order); }}
                    badgeColor="border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400"
                  />
                ))}
                {orders.filter(o => o.status === "new").length === 0 && <EmptyColumnText text="Tudo em produção!" />}
              </div>
            </div>

            {/* Column 2: EM PREPARAÇÃO */}
            <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-xl border border-slate-200/70 dark:border-white/[0.03]">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.04] pb-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-extrabold text-xs tracking-wider text-slate-600 dark:text-slate-300 uppercase">2. Em Preparação</span>
                </div>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-[10px] font-bold">
                  {orders.filter(o => o.status === "preparing").length}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 min-h-[450px]">
                {orders.filter(o => o.status === "preparing").map(order => (
                  <CompactOrderCard
                    key={order.id}
                    order={order}
                    getSlaInfo={getSlaInfo}
                    onOpenDetails={() => { playKfsSound("click", isMuted); setSelectedOrder(order); }}
                    badgeColor="border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400"
                  />
                ))}
                {orders.filter(o => o.status === "preparing").length === 0 && <EmptyColumnText text="Nenhum prato no fogo." />}
              </div>
            </div>

            {/* Column 3: CONCLUÍDO (Aguardando levar à mesa) */}
            <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-xl border border-slate-200/70 dark:border-white/[0.03]">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.04] pb-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-extrabold text-xs tracking-wider text-slate-600 dark:text-slate-300 uppercase">3. Concluídos (Saída)</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-bold">
                  {orders.filter(o => o.status === "ready").length}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 min-h-[450px]">
                {orders.filter(o => o.status === "ready").map(order => (
                  <CompactOrderCard
                    key={order.id}
                    order={order}
                    getSlaInfo={getSlaInfo}
                    onOpenDetails={() => { playKfsSound("click", isMuted); setSelectedOrder(order); }}
                    badgeColor="border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                  />
                ))}
                {orders.filter(o => o.status === "ready").length === 0 && <EmptyColumnText text="Aguardando liberação." />}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: SALON / WAITER DASHBOARD */}
        {activeTab === "salao" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2 flex flex-col gap-4 bg-slate-50 dark:bg-slate-950/30 p-5 rounded-xl border border-slate-200 dark:border-white/[0.03]">
              <div className="border-b border-slate-200 dark:border-white/[0.04] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Utensils className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400" />
                    Pratos Prontos para Retirada
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Garçons devem retirar e levar à mesa imediatamente.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {orders.filter(o => o.status === "ready").map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-500/5 flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-500/10 pb-2 mb-2">
                        <span className="text-sm font-extrabold text-slate-800 dark:text-white">{order.identifier}</span>
                        <Badge className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-255/20 font-bold text-[9px]">Pronto</Badge>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex justify-between">
                            <span>{it.name}</span>
                            <span className="font-bold">{it.quantity}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => changeStatus(order.id, "delivered")}
                      className="w-full mt-3 bg-emerald-600 hover:bg-emerald-555 text-white font-bold text-xs uppercase h-9 rounded-lg"
                    >
                      Confirmar Entrega na Mesa
                    </Button>
                  </div>
                ))}
                {orders.filter(o => o.status === "ready").length === 0 && (
                  <div className="col-span-2 py-10 text-center text-slate-500 text-xs border border-dashed border-slate-200 dark:border-white/[0.04] rounded-lg">
                    Nenhum prato na fila de saída. Salão em dia!
                  </div>
                )}
              </div>
            </div>

            {/* Waiter side progress */}
            <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-950/30 p-5 rounded-xl border border-slate-200 dark:border-white/[0.03]">
              <div className="border-b border-slate-200 dark:border-white/[0.04] pb-3">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Pedidos no Fogo (Preparando)</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {orders.filter(o => o.status === "preparing").map(order => {
                  const { timeText, color } = getSlaInfo(order.createdAt)
                  return (
                    <div key={order.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-white/[0.03] bg-white dark:bg-white/[0.01] flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-white block">{order.identifier}</span>
                        <span className="text-[10px] text-slate-500">Estimado: {order.estimatedTime} min</span>
                      </div>
                      <span className={cn("font-mono font-bold", color)}>{timeText}</span>
                    </div>
                  )
                })}
                {orders.filter(o => o.status === "preparing").length === 0 && (
                  <div className="text-center text-slate-500 py-6 text-xs">Sem pratos no fogo atualmente.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: METRICAS & EXPEDICAO */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/[0.04] text-slate-800 dark:text-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Tempo de SLA</span>
                    <span className="text-xl font-extrabold block text-emerald-600 dark:text-emerald-400">{averagePrepTime} min</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/[0.04] text-slate-800 dark:text-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Pedidos Ativos</span>
                    <span className="text-xl font-extrabold block text-blue-600 dark:text-blue-400">{totalActive}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/[0.04] text-slate-800 dark:text-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Atrasos Críticos</span>
                    <span className="text-xl font-extrabold block text-red-650 dark:text-red-400">{totalDelayed}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/[0.04] text-slate-800 dark:text-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Finalizados Turno</span>
                    <span className="text-xl font-extrabold block text-indigo-650 dark:text-indigo-400">{totalCompleted}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/30 p-5 rounded-xl border border-slate-200 dark:border-white/[0.03]">
              <h3 className="font-bold text-sm mb-3">Histórico e Triagem da Expedição</h3>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {orders.map(order => (
                  <div key={order.id} className="p-3 rounded-lg border border-slate-200 dark:border-white/[0.03] bg-white dark:bg-white/[0.01] flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-white">{order.identifier}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 🚀 OVERLAY DETAILED OPERATIONAL MODAL (CLICK CARD) */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-lg bg-white dark:bg-[#141b2d] border border-slate-200 dark:border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden text-slate-800 dark:text-slate-100"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-950/40 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedOrder.identifier}
                    {selectedOrder.priority === "vip" && (
                      <Badge className="bg-purple-600 text-white border-0 font-bold text-[9px] px-2 py-0.5">VIP</Badge>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Código do pedido: {selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 flex flex-col gap-4">
                {/* SLA and status metadata banner */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-100 dark:border-white/[0.04]">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Status Atual</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        selectedOrder.status === "new" && "bg-blue-500",
                        selectedOrder.status === "preparing" && "bg-amber-500",
                        selectedOrder.status === "ready" && "bg-emerald-500"
                      )} />
                      {selectedOrder.status === "new" && "Pendente / Aguardando Preparo"}
                      {selectedOrder.status === "preparing" && "Em Preparação"}
                      {selectedOrder.status === "ready" && "Concluído (Aguardando levar à mesa)"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Cronômetro SLA</span>
                    <span className={cn("font-mono text-sm block font-black mt-0.5", getSlaInfo(selectedOrder.createdAt).color)}>
                      {getSlaInfo(selectedOrder.createdAt).timeText}
                    </span>
                  </div>
                </div>

                {/* List of items */}
                <div>
                  <h4 className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider border-b border-slate-100 dark:border-white/[0.04] pb-1.5 mb-2.5">Itens do Pedido</h4>
                  <div className="space-y-3.5">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex flex-col gap-1 pb-2.5 border-b border-slate-100 dark:border-white/[0.02] last:border-0 last:pb-0">
                        <div className="flex justify-between items-center text-slate-800 dark:text-white">
                          <span className="text-sm font-bold">{it.name}</span>
                          <Badge variant="outline" className="border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5">
                            {it.quantity}x
                          </Badge>
                        </div>
                        {it.notes && (
                          <span className="text-xs text-red-650 dark:text-red-400 font-semibold bg-red-500/[0.03] dark:bg-red-500/5 px-2.5 py-1 rounded border border-red-100 dark:border-red-500/10">
                            ⚠️ OBSERVAÇÃO: {it.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preset time indicators (if preparing) */}
                {selectedOrder.estimatedTime && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 text-xs text-indigo-700 dark:text-indigo-300">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>Tempo de preparo estipulado de <strong>{selectedOrder.estimatedTime} minutos</strong> em andamento.</span>
                  </div>
                )}
              </div>

              {/* Modal Tactile Footer (1-Touch Giant Buttons) */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-950/40">
                {selectedOrder.status === "new" && (
                  <Button
                    onClick={() => changeStatus(selectedOrder.id, "preparing")}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm uppercase h-14 tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg shadow-amber-600/10"
                  >
                    <Play className="h-4.5 w-4.5 fill-white" />
                    Iniciar Preparo (Tempo: 15 min)
                  </Button>
                )}

                {selectedOrder.status === "preparing" && (
                  <Button
                    onClick={() => changeStatus(selectedOrder.id, "ready")}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase h-14 tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg shadow-emerald-600/10"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    Marcar como Concluído
                  </Button>
                )}

                {selectedOrder.status === "ready" && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => changeStatus(selectedOrder.id, "delivered")}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm uppercase h-14 tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg shadow-indigo-600/10"
                    >
                      <Check className="h-4.5 w-4.5" />
                      Confirmar Entrega na Mesa
                    </Button>
                    <p className="text-center text-[10px] text-slate-500">
                      Disponibilizado na saída. Garçons notificados automaticamente.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Notifications / Toasts overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="p-4 bg-slate-900 border border-white/[0.08] shadow-2xl rounded-2xl text-xs text-white pointer-events-auto flex items-center justify-between gap-3"
            >
              <span>{toast.message}</span>
              <button
                onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Compact Sub-components
function EmptyColumnText({ text }: { text: string }) {
  return (
    <div className="py-8 text-center text-slate-450 dark:text-slate-600 text-[11px] font-medium border border-dashed border-slate-200 dark:border-white/[0.04] rounded-lg bg-white/[0.005]">
      {text}
    </div>
  )
}

interface CompactCardProps {
  order: KfsOrder
  getSlaInfo: (d: Date) => { timeText: string; color: string; bg: string }
  onOpenDetails: () => void
  badgeColor: string
}

function CompactOrderCard({ order, getSlaInfo, onOpenDetails, badgeColor }: CompactCardProps) {
  const { timeText, color, bg } = getSlaInfo(order.createdAt)
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const isVip = order.priority === "vip"
  const isHigh = order.priority === "high"

  return (
    <motion.div
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpenDetails}
      className={cn(
        "cursor-pointer p-3 rounded-lg transition-all shadow-sm flex justify-between items-center gap-3",
        "bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#253248] text-slate-800 dark:text-white border border-slate-100 dark:border-white/[0.06]",
        isVip && "border-purple-200 dark:border-purple-500/20 bg-purple-50/30 dark:bg-purple-950/5 hover:bg-purple-50/50 dark:hover:bg-purple-950/10",
        isHigh && "border-red-200 dark:border-red-500/10 bg-red-50/30 dark:bg-red-950/5 hover:bg-red-50/50 dark:hover:bg-red-950/10",
        bg
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-xs text-slate-850 dark:text-white truncate">{order.identifier}</span>
          <Badge variant="outline" className={cn("px-1.5 py-0 text-[8px] font-bold uppercase", badgeColor)}>
            {order.origin}
          </Badge>
          {isVip && (
            <Badge className="bg-purple-600 text-white font-bold text-[8px] px-1 py-0 border-0 uppercase">VIP</Badge>
          )}
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          {totalQty} {totalQty === 1 ? "item" : "itens"} {order.items[0]?.notes && "⚠️"}
        </span>
      </div>

      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <span className={cn("font-mono text-xs font-bold block", color)}>
          {timeText}
        </span>
        {order.status === "preparing" && (
          <span className="text-[8px] text-amber-500 dark:text-amber-400 font-semibold uppercase tracking-widest animate-pulse">Preparo</span>
        )}
      </div>
    </motion.div>
  )
}
