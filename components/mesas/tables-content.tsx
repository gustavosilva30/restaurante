"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Clock,
  Receipt,
  ArrowRightLeft,
  Split,
  UserPlus,
  X,
  Check,
  DollarSign,
  Move,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Utensils,
  Plus,
  Minus,
  AlertOctagon,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type TableStatus = "free" | "occupied" | "reserved" | "closing"
type TableShape = "round" | "square" | "rectangle"
type RoomArea = "main" | "garden" | "vip"

interface Table {
  id: string
  number: number
  capacity: number
  status: TableStatus
  shape: TableShape
  area: RoomArea
  x: number // Position X in percentage (0-100)
  y: number // Position Y in percentage (0-100)
  currentOrder?: string
  totalAmount?: number
  seatedCount?: number
  reservationName?: string
  reservationTime?: string
  reservationPhone?: string
  itemsConsumed?: Array<{ name: string; quantity: number; price: number }>
}

const initialTables: Table[] = [
  // MAIN ROOM
  { id: "m1", number: 1, capacity: 2, status: "free", shape: "round", area: "main", x: 15, y: 20 },
  { id: "m2", number: 2, capacity: 4, status: "occupied", shape: "square", area: "main", x: 45, y: 20, currentOrder: "ORD-101", totalAmount: 189.50, seatedCount: 3, itemsConsumed: [{ name: "Risoto de Alho Poró", quantity: 2, price: 65.00 }, { name: "Suco de Laranja", quantity: 3, price: 9.90 }, { name: "Vinho Chardonnay", quantity: 1, price: 29.80 }] },
  { id: "m3", number: 3, capacity: 8, status: "occupied", shape: "rectangle", area: "main", x: 75, y: 25, currentOrder: "ORD-102", totalAmount: 540.00, seatedCount: 6, itemsConsumed: [{ name: "Corte Angus Premium", quantity: 4, price: 110.00 }, { name: "Vinho Cabernet", quantity: 2, price: 50.00 }] },
  { id: "m4", number: 4, capacity: 4, status: "reserved", shape: "square", area: "main", x: 15, y: 60, reservationName: "Dra. Carolina M.", reservationTime: "20:30", reservationPhone: "(11) 98765-4321" },
  { id: "m5", number: 5, capacity: 2, status: "free", shape: "round", area: "main", x: 45, y: 65 },
  { id: "m6", number: 6, capacity: 4, status: "closing", shape: "square", area: "main", x: 75, y: 70, currentOrder: "ORD-103", totalAmount: 245.90, seatedCount: 4, itemsConsumed: [{ name: "Gnocchi ao Ragu", quantity: 3, price: 58.00 }, { name: "Sobremesa Petit Gateau", quantity: 2, price: 28.00 }] },
  
  // GARDEN ROOM
  { id: "g11", number: 11, capacity: 4, status: "free", shape: "round", area: "garden", x: 20, y: 25 },
  { id: "g12", number: 12, capacity: 6, status: "occupied", shape: "rectangle", area: "garden", x: 60, y: 30, currentOrder: "ORD-201", totalAmount: 320.00, seatedCount: 5, itemsConsumed: [{ name: "Tábua Fria do Chefe", quantity: 1, price: 120.00 }, { name: "Cerveja Belga", quantity: 8, price: 25.00 }] },
  { id: "g13", number: 13, capacity: 2, status: "reserved", shape: "round", area: "garden", x: 20, y: 70, reservationName: "Eng. Pedro Costa", reservationTime: "21:00", reservationPhone: "(21) 99999-8888" },
  { id: "g14", number: 14, capacity: 4, status: "free", shape: "square", area: "garden", x: 60, y: 70 },

  // VIP ROOM
  { id: "v21", number: 21, capacity: 4, status: "occupied", shape: "round", area: "vip", x: 25, y: 25, currentOrder: "ORD-301", totalAmount: 890.00, seatedCount: 2, itemsConsumed: [{ name: "Lagosta Thermidor", quantity: 2, price: 350.00 }, { name: "Champagne Taittinger", quantity: 1, price: 190.00 }] },
  { id: "v22", number: 22, capacity: 10, status: "free", shape: "rectangle", area: "vip", x: 70, y: 45 },
  { id: "v23", number: 23, capacity: 4, status: "free", shape: "square", area: "vip", x: 25, y: 70 },
]

const statusConfig: Record<TableStatus, { label: string; color: string; bgColor: string; ledColor: string; bgPulse: string }> = {
  free: { label: "Livre", color: "text-emerald-500", bgColor: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50", ledColor: "bg-emerald-500 shadow-[0_0_10px_#10b981]", bgPulse: "bg-emerald-500/20" },
  occupied: { label: "Ocupada", color: "text-indigo-500", bgColor: "bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/50", ledColor: "bg-indigo-500 shadow-[0_0_10px_#6366f1]", bgPulse: "bg-indigo-500/20" },
  reserved: { label: "Reservada", color: "text-amber-500", bgColor: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50", ledColor: "bg-amber-500 shadow-[0_0_10px_#f59e0b]", bgPulse: "bg-amber-500/20" },
  closing: { label: "Fechando", color: "text-rose-500", bgColor: "bg-rose-500/5 border-rose-500/25 hover:border-rose-500/50", ledColor: "bg-rose-500 shadow-[0_0_10px_#f43f5e]", bgPulse: "bg-rose-500/30" },
}

// Quick items menu for simulating order inputs
const quickBillingMenu = [
  { name: "Água com Gás Gourmet", price: 7.50 },
  { name: "Suco Natural de Frutas", price: 12.00 },
  { name: "Cerveja Premium Artesanal", price: 18.00 },
  { name: "Tábua de Frios Nobres", price: 85.00 },
  { name: "Filé Mignon ao Demi-Glace", price: 110.00 },
  { name: "Risoto Tartufado", price: 79.00 },
  { name: "Petit Gateau com Gelato", price: 29.00 },
]

interface TablesContentProps {
  initialTables: Table[]
  companyId: string
}

export function TablesContent({ initialTables, companyId }: TablesContentProps) {
  const [tables, setTables] = React.useState<Table[]>(initialTables)
  const [selectedTableId, setSelectedTableId] = React.useState<string | null>(null)
  const [activeArea, setActiveArea] = React.useState<RoomArea>("main")
  const [isEditLayoutMode, setIsEditLayoutMode] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [reservationOpen, setReservationOpen] = React.useState(false)
  
  // Custom states for design mode table operations
  const [isEditTableOpen, setIsEditTableOpen] = React.useState(false)
  const [editingTable, setEditingTable] = React.useState<Table | null>(null)
  const [isAddTableOpen, setIsAddTableOpen] = React.useState(false)
  
  // Design fields
  const [newTableNumber, setNewTableNumber] = React.useState<number>(1)
  const [newTableCapacity, setNewTableCapacity] = React.useState<number>(4)
  const [newTableShape, setNewTableShape] = React.useState<TableShape>("square")
  const [newTableArea, setNewTableArea] = React.useState<RoomArea>(activeArea)

  const [editTableNumber, setEditTableNumber] = React.useState<number>(1)
  const [editTableCapacity, setEditTableCapacity] = React.useState<number>(4)
  const [editTableShape, setEditTableShape] = React.useState<TableShape>("square")
  const [editTableArea, setEditTableArea] = React.useState<RoomArea>("main")

  // Sync adding room area when active tab changes
  React.useEffect(() => {
    setNewTableArea(activeArea)
  }, [activeArea])

  // Reservation form states
  const [resName, setResName] = React.useState("")
  const [resTime, setResTime] = React.useState("")
  const [resPhone, setResPhone] = React.useState("")
  const [resSize, setResSize] = React.useState(4)
  
  // Open table customer count selection
  const [openingGuests, setOpeningGuests] = React.useState(2)

  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedTable = tables.find((t) => t.id === selectedTableId) || null

  const filteredTables = tables.filter((table) => table.area === activeArea)

  const stats = {
    free: tables.filter((t) => t.status === "free").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    closing: tables.filter((t) => t.status === "closing").length,
    seatsUsed: tables.filter((t) => t.status === "occupied").reduce((sum, t) => sum + (t.seatedCount || 0), 0),
    totalSeats: tables.reduce((sum, t) => sum + t.capacity, 0),
  }

  const handleTableClick = (table: Table) => {
    if (isEditLayoutMode) {
      setEditingTable(table)
      setEditTableNumber(table.number)
      setEditTableCapacity(table.capacity)
      setEditTableShape(table.shape)
      setEditTableArea(table.area)
      setIsEditTableOpen(true)
      return
    }
    setSelectedTableId(table.id)
    setDialogOpen(true)
  }

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTable) return

    // check number duplication
    const numTaken = tables.some(
      (t) => t.id !== editingTable.id && t.number === editTableNumber
    )
    if (numTaken) {
      alert(`Erro: O número da mesa ${editTableNumber} já está em uso por outra mesa!`)
      return
    }

    const updated = {
      ...editingTable,
      number: editTableNumber,
      capacity: editTableCapacity,
      shape: editTableShape,
      area: editTableArea,
      companyId,
    }

    setTables((prev) =>
      prev.map((t) => (t.id === editingTable.id ? updated : t))
    )
    setIsEditTableOpen(false)
    setEditingTable(null)

    await fetch("/api/tables", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
  }

  const handleDeleteTable = async (tableId: string) => {
    if (!editingTable) return
    if (confirm(`Tem certeza que deseja excluir permanentemente a Mesa ${editingTable.number}?`)) {
      setTables((prev) => prev.filter((t) => t.id !== tableId))
      setIsEditTableOpen(false)
      setEditingTable(null)

      await fetch(`/api/tables?id=${tableId}`, { method: "DELETE" })
    }
  }

  const handleAddTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // check duplicate
    const numTaken = tables.some((t) => t.number === newTableNumber)
    if (numTaken) {
      alert(`Erro: O número da mesa ${newTableNumber} já está em uso!`)
      return
    }

    const newTableId = `table_${Date.now()}`
    const newTable: Table = {
      id: newTableId,
      number: newTableNumber,
      capacity: newTableCapacity,
      status: "free",
      shape: newTableShape,
      area: newTableArea,
      x: 45,
      y: 45,
    }

    setTables((prev) => [...prev, newTable])
    setIsAddTableOpen(false)

    await fetch("/api/tables", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTable, companyId }),
    })
  }

  // drag-and-drop end callback that saves updated position % in state
  const handleDragEnd = async (tableId: string, event: any, info: any) => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    
    // Calculate final dropped coordinates relative to container width/height
    const xOffset = info.point.x - containerRect.left
    const yOffset = info.point.y - containerRect.top
    
    let xPercent = Math.max(0, Math.min(100, (xOffset / containerRect.width) * 100))
    let yPercent = Math.max(0, Math.min(100, (yOffset / containerRect.height) * 100))

    // Round to nearest integer for clean layout alignment
    xPercent = Math.round(xPercent)
    yPercent = Math.round(yPercent)

    let draggedTable: Table | null = null

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          draggedTable = { ...t, x: xPercent, y: yPercent }
          return draggedTable
        }
        return t
      })
    )

    if (draggedTable) {
      await fetch("/api/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draggedTable, companyId }),
      })
    }
  }

  const handleOpenTable = async () => {
    if (!selectedTable) return
    const updated = {
      ...selectedTable,
      status: "occupied" as TableStatus,
      currentOrder: `ORD-${Math.floor(Math.random() * 900) + 100}`,
      totalAmount: 0,
      seatedCount: openingGuests,
      itemsConsumed: [],
    }

    setTables((prev) =>
      prev.map((t) => (t.id === selectedTable.id ? updated : t))
    )
    setDialogOpen(false)

    await fetch("/api/tables", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updated, companyId }),
    })
  }

  const handleAddConsumptionItem = async (itemName: string, itemPrice: number) => {
    if (!selectedTableId) return
    let updatedTable: Table | null = null

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          const currentItems = t.itemsConsumed ? [...t.itemsConsumed] : []
          const existingItemIdx = currentItems.findIndex(i => i.name === itemName)
          
          if (existingItemIdx >= 0) {
            currentItems[existingItemIdx].quantity += 1
          } else {
            currentItems.push({ name: itemName, quantity: 1, price: itemPrice })
          }

          const newTotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          updatedTable = {
            ...t,
            itemsConsumed: currentItems,
            totalAmount: Number(newTotal.toFixed(2)),
          }
          return updatedTable
        }
        return t
      })
    )

    if (updatedTable) {
      await fetch("/api/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedTable, companyId }),
      })
    }
  }

  const handleRemoveConsumptionItem = async (itemName: string) => {
    if (!selectedTableId) return
    let updatedTable: Table | null = null

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          const currentItems = t.itemsConsumed ? [...t.itemsConsumed] : []
          const existingItemIdx = currentItems.findIndex(i => i.name === itemName)
          
          if (existingItemIdx >= 0) {
            currentItems[existingItemIdx].quantity -= 1
            if (currentItems[existingItemIdx].quantity <= 0) {
              currentItems.splice(existingItemIdx, 1)
            }
          }

          const newTotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          updatedTable = {
            ...t,
            itemsConsumed: currentItems,
            totalAmount: Number(newTotal.toFixed(2)),
          }
          return updatedTable
        }
        return t
      })
    )

    if (updatedTable) {
      await fetch("/api/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedTable, companyId }),
      })
    }
  }

  const handleRequestBill = async () => {
    if (!selectedTableId) return
    let updatedTable: Table | null = null

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          updatedTable = { ...t, status: "closing" as TableStatus }
          return updatedTable
        }
        return t
      })
    )
    setDialogOpen(false)

    if (updatedTable) {
      await fetch("/api/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedTable, companyId }),
      })
    }
  }

  const handleCloseAndFreeTable = async () => {
    if (!selectedTableId) return
    let updatedTable: Table | null = null

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          updatedTable = {
            ...t,
            status: "free" as TableStatus,
            currentOrder: undefined,
            totalAmount: undefined,
            seatedCount: undefined,
            itemsConsumed: undefined,
            reservationName: undefined,
            reservationTime: undefined,
            reservationPhone: undefined,
          }
          return updatedTable
        }
        return t
      })
    )
    setDialogOpen(false)

    if (updatedTable) {
      await fetch("/api/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedTable, companyId }),
      })
    }
  }

  const handleOpenReservation = () => {
    if (!selectedTable) return
    setResName("")
    setResTime("20:00")
    setResPhone("")
    setResSize(selectedTable.capacity)
    setDialogOpen(false)
    setReservationOpen(true)
  }

  const handleSaveReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTableId || !resName || !resTime) return
    let updatedTable: Table | null = null

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          updatedTable = {
            ...t,
            status: "reserved" as TableStatus,
            reservationName: resName,
            reservationTime: resTime,
            reservationPhone: resPhone,
            capacity: resSize,
          }
          return updatedTable
        }
        return t
      })
    )
    setReservationOpen(false)

    if (updatedTable) {
      await fetch("/api/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedTable, companyId }),
      })
    }
  }

  // Dynamic chairs positioning helper for realistic geometric table cards
  const renderChairs = (capacity: number, shape: TableShape) => {
    const chairs = []
    const count = Math.min(capacity, 10)
    for (let i = 0; i < count; i++) {
      let positionClass = ""
      
      if (shape === "round") {
        const angle = (i * 360) / count
        const radius = 35 // relative distance from table center
        const xOffset = Math.cos((angle * Math.PI) / 180) * radius
        const yOffset = Math.sin((angle * Math.PI) / 180) * radius
        
        chairs.push(
          <div
            key={i}
            className="absolute h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 shadow-inner border border-white dark:border-slate-800"
            style={{
              left: `calc(50% + ${xOffset}px - 6px)`,
              top: `calc(50% + ${yOffset}px - 6px)`,
            }}
          />
        )
        continue
      } else if (shape === "rectangle") {
        // Rectangle chairs along long sides
        const half = Math.ceil(count / 2)
        const isTop = i < half
        const sideIndex = i % half
        const leftPercent = 15 + (sideIndex * 70) / Math.max(half - 1, 1)
        
        positionClass = isTop 
          ? "top-[-10px]" 
          : "bottom-[-10px]"
        
        chairs.push(
          <div
            key={i}
            className={cn("absolute h-3 w-3 rounded-md bg-slate-300 dark:bg-slate-700 shadow-inner border border-white dark:border-slate-800", positionClass)}
            style={{ left: `${leftPercent}%` }}
          />
        )
        continue
      } else {
        // Square chairs on four sides
        if (i === 0) positionClass = "top-[-9px] left-[50%] -translate-x-1/2"
        else if (i === 1) positionClass = "bottom-[-9px] left-[50%] -translate-x-1/2"
        else if (i === 2) positionClass = "left-[-9px] top-[50%] -translate-y-1/2"
        else if (i === 3) positionClass = "right-[-9px] top-[50%] -translate-y-1/2"
        else positionClass = "top-[-9px] left-[30%]"

        chairs.push(
          <div
            key={i}
            className={cn("absolute h-3.5 w-3.5 rounded bg-slate-300 dark:bg-slate-700 border border-white dark:border-slate-800", positionClass)}
          />
        )
      }
    }
    return chairs
  }

  return (
    <div className="space-y-6">
      
      {/* 1. SEATING ROOM STATS COUNTER */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 select-none">
        {Object.entries(statusConfig).map(([key, config]) => (
          <Card key={key} className="rounded-3xl border-slate-100 dark:border-muted shadow-sm overflow-hidden bg-white dark:bg-card">
            <CardContent className="flex items-center justify-between p-4.5">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400">{config.label}</p>
                <p className={cn("text-2xl font-black mt-0.5", config.color)}>
                  {stats[key as keyof typeof stats]}
                </p>
              </div>
              <div className={cn("rounded-full p-2.5", config.bgPulse)}>
                <div className={cn("h-3 w-3 rounded-full animate-pulse", config.ledColor)} />
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="rounded-3xl border-slate-100 dark:border-muted shadow-sm overflow-hidden bg-white dark:bg-card col-span-2">
          <CardContent className="flex items-center justify-between p-4.5">
            <div>
              <p className="text-[10px] font-extrabold uppercase text-slate-400">Capacidade / Ocupação</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-50">{stats.seatsUsed}</span>
                <span className="text-xs text-muted-foreground font-bold">/ {stats.totalSeats} sentados</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-slate-300 dark:text-muted shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* 2. MAIN ROOM LAYOUT WORKSPACE AREA */}
      <Card className="rounded-[32px] border-slate-100 dark:border-muted shadow-lg overflow-hidden bg-white dark:bg-card">
        <CardHeader className="border-b bg-slate-50/50 dark:bg-muted/15 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Room Area Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-muted rounded-2xl w-max border">
              <button
                onClick={() => setActiveArea("main")}
                className={cn(
                  "flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                  activeArea === "main" ? "bg-white dark:bg-card shadow-md text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Layers className="h-4.5 w-4.5" />
                <span>Salão Nobre</span>
              </button>
              <button
                onClick={() => setActiveArea("garden")}
                className={cn(
                  "flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                  activeArea === "garden" ? "bg-white dark:bg-card shadow-md text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MapPin className="h-4.5 w-4.5" />
                <span>Terraço Garden</span>
              </button>
              <button
                onClick={() => setActiveArea("vip")}
                className={cn(
                  "flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                  activeArea === "vip" ? "bg-white dark:bg-card shadow-md text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                <span>Lounge VIP</span>
              </button>
            </div>

            {/* Drag layout activation controls */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-extrabold uppercase text-[10px] text-muted-foreground tracking-widest px-3 py-1.5 rounded-xl bg-slate-100/50 dark:bg-muted/10">
                {filteredTables.length} mesas na área
              </Badge>

              <Button
                variant={isEditLayoutMode ? "default" : "outline"}
                onClick={() => setIsEditLayoutMode(!isEditLayoutMode)}
                className={cn(
                  "rounded-xl font-extrabold text-xs h-10 px-4.5 border-slate-200 dark:border-muted active:scale-95 transition-all shadow-sm",
                  isEditLayoutMode && "bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
              >
                <Move className="h-4.5 w-4.5 mr-2" />
                {isEditLayoutMode ? "Salvar Posições" : "Editar Layout"}
              </Button>

              {isEditLayoutMode && (
                <Button
                  onClick={() => {
                    const maxNum = tables.reduce((max, t) => (t.number > max ? t.number : max), 0)
                    setNewTableNumber(maxNum + 1)
                    setNewTableCapacity(4)
                    setNewTableShape("square")
                    setNewTableArea(activeArea)
                    setIsAddTableOpen(true)
                  }}
                  className="rounded-xl font-extrabold text-xs h-10 px-4.5 bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition-all border-0 shadow-md shrink-0"
                >
                  <Plus className="h-4.5 w-4.5 mr-1.5" />
                  Nova Mesa
                </Button>
              )}
            </div>

          </div>
        </CardHeader>
        
        {/* ROOM INTERACTIVE GRAPHICAL CANVAS */}
        <CardContent className="p-0 relative select-none">
          
          {isEditLayoutMode && (
            <div className="absolute top-4 left-4 bg-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-xl shadow-lg z-20 flex items-center gap-2 animate-bounce">
              <Move className="h-4 w-4" />
              <span>Modo Design: Arraste as mesas para reposicionar</span>
            </div>
          )}

          <div
            ref={containerRef}
            className="w-full h-[520px] bg-slate-50/50 dark:bg-slate-950/20 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] rounded-b-[32px] border-t"
          >
            {/* Grid overlay for aesthetic room floor style */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/5 to-transparent dark:from-black/10 pointer-events-none" />

            <AnimatePresence>
              {filteredTables.map((table) => {
                const config = statusConfig[table.status]
                const isRound = table.shape === "round"
                const isRect = table.shape === "rectangle"
                const isDragging = isEditLayoutMode
                
                return (
                  <motion.div
                    key={table.id}
                    layout={!isEditLayoutMode}
                    drag={isEditLayoutMode}
                    dragMomentum={false}
                    dragElastic={0}
                    dragConstraints={containerRef}
                    onDragEnd={(e, info) => handleDragEnd(table.id, e, info)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                    }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      position: "absolute", 
                      left: `${table.x}%`, 
                      top: `${table.y}%`,
                      marginLeft: isRect ? "-56px" : "-40px",
                      marginTop: "-40px"
                    }}
                    className="z-10"
                  >
                    {/* Visual chairs container surrounding the table card */}
                    <div className="relative p-2.5">
                      {renderChairs(table.capacity, table.shape)}
                      
                      {/* Actual Table Card body */}
                      <button
                        onClick={() => handleTableClick(table)}
                        disabled={false}
                        className={cn(
                          "relative select-none flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 border-2 border-transparent bg-white dark:bg-card overflow-hidden",
                          isRound ? "rounded-full h-20 w-20" : isRect ? "rounded-3xl h-20 w-28 aspect-[1.8/1]" : "rounded-[22px] h-20 w-20",
                          config.bgColor,
                          isEditLayoutMode ? "cursor-pointer border-dashed border-indigo-500 shadow-xl ring-2 ring-indigo-500/20" : "cursor-pointer"
                        )}
                      >
                        {/* Status Pulser dot */}
                        <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                          <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse", config.ledColor)} />
                        </div>

                        {/* Table Number */}
                        <span className={cn("text-base font-black tracking-tight", config.color)}>
                          {table.number}
                        </span>

                        {/* Guest indicators */}
                        <div className="flex items-center gap-0.5 text-[9px] font-bold text-muted-foreground">
                          {table.status === "occupied" ? (
                            <>
                              <Users className="h-3 w-3 text-indigo-500" />
                              <span className="text-indigo-600 font-extrabold">{table.seatedCount}</span>
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3" />
                              <span>{table.capacity}</span>
                            </>
                          )}
                        </div>

                        {/* Details overlay (Amount consumed or customer name) */}
                        {table.status === "occupied" && table.totalAmount !== undefined && table.totalAmount > 0 && (
                          <div className="text-[10px] font-black text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-muted py-0.5 px-2 rounded-md shadow-sm border border-slate-200/50">
                            R$ {Math.round(table.totalAmount)}
                          </div>
                        )}

                        {table.status === "reserved" && (
                          <div className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 py-0.5 px-1.5 rounded-md truncate max-w-[70px]">
                            {table.reservationName?.split(" ")[0]}
                          </div>
                        )}

                        {table.status === "closing" && (
                          <div className="text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 py-0.5 px-1.5 rounded-md animate-pulse">
                            Conta
                          </div>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* 3. TABLE DETAILS OVERLAY DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-card">
          {selectedTable && (
            <>
              {/* Luxury header */}
              <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-indigo-500" />
                    Mesa {selectedTable.number}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    Área: {selectedTable.area === "main" ? "Salão Nobre" : selectedTable.area === "garden" ? "Terraço Garden" : "Lounge VIP"}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "font-extrabold border shadow-sm px-2.5 py-1 text-[10px] uppercase rounded-xl",
                    statusConfig[selectedTable.status].ledColor.replace("bg-", "text-").replace("shadow-", ""),
                    statusConfig[selectedTable.status].bgColor
                  )}
                >
                  {statusConfig[selectedTable.status].label}
                </Badge>
              </div>

              <div className="p-6 space-y-6">
                
                {/* 1. OCCUPIED TABLE INFO & SIMULATED CONSUMPTION */}
                {selectedTable.status === "occupied" && (
                  <div className="space-y-4">
                    {/* Order Details Banner */}
                    <div className="grid grid-cols-2 gap-3 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Comanda / Ordem</span>
                        <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{selectedTable.currentOrder}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Clientes</span>
                        <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">👥 {selectedTable.seatedCount} Pessoas</p>
                      </div>
                    </div>

                    {/* Consumed Items Simulated List */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Produtos Consumidos</h4>
                      <ScrollArea className="max-h-[140px] border border-slate-100 dark:border-muted rounded-2xl bg-slate-50/50 dark:bg-muted/10 p-3">
                        <div className="space-y-2">
                          {selectedTable.itemsConsumed && selectedTable.itemsConsumed.length > 0 ? (
                            selectedTable.itemsConsumed.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                  <span className="bg-slate-200 dark:bg-muted text-slate-700 dark:text-slate-300 font-extrabold px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                                  <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                                  <button onClick={() => handleRemoveConsumptionItem(item.name)} className="text-red-500 hover:text-red-700 p-0.5">
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-6 text-xs text-muted-foreground font-semibold">Sem itens lançados nesta mesa.</p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* QUICK ADD ITEMS SELECTOR (Consumption simulator) */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Lançar Consumo Rápido (Touch)</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {quickBillingMenu.map((menuItem) => (
                          <button
                            key={menuItem.name}
                            onClick={() => handleAddConsumptionItem(menuItem.name, menuItem.price)}
                            className="flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 bg-slate-100 dark:bg-muted hover:bg-slate-200 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                          >
                            <Plus className="h-3 w-3 text-emerald-500" />
                            <span>{menuItem.name} • R$ {menuItem.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total Invoice billing banner */}
                    <div className="flex justify-between items-center p-4 bg-slate-900 dark:bg-muted text-white rounded-2xl">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Subtotal + Serviços</span>
                        <p className="text-[10px] text-emerald-400 font-bold">10% Opcional incluso</p>
                      </div>
                      <p className="text-xl font-black text-emerald-400">
                        R$ {((selectedTable.totalAmount || 0) * 1.1).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. RESERVED TABLE DETAILS */}
                {selectedTable.status === "reserved" && (
                  <div className="p-4.5 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-3 text-xs font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nome da Reserva</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{selectedTable.reservationName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Horário Previsto</span>
                      <span className="font-extrabold text-amber-500 flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {selectedTable.reservationTime}
                      </span>
                    </div>
                    {selectedTable.reservationPhone && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Contato</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">{selectedTable.reservationPhone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CLOSING STATUS DETAILS */}
                {selectedTable.status === "closing" && (
                  <div className="space-y-4">
                    <div className="p-5 bg-rose-500/5 border border-rose-500/15 rounded-2xl text-center space-y-1 animate-pulse">
                      <AlertOctagon className="h-8 w-8 text-rose-500 mx-auto" />
                      <h4 className="font-black text-rose-600 dark:text-rose-400 text-sm pt-1">Aguardando Pagamento</h4>
                      <p className="text-xs text-muted-foreground">O cliente solicitou o fechamento da conta física.</p>
                    </div>
                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Total a Pagar</span>
                        <p className="text-xs text-slate-400">Com comissão do garçom</p>
                      </div>
                      <p className="text-2xl font-black text-emerald-400">
                        R$ {((selectedTable.totalAmount || 0) * 1.1).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. SEATED COUNT SELECTOR (Used before opening table) */}
                {selectedTable.status === "free" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-100 dark:bg-muted/30 rounded-2xl border flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Quantidade de Pessoas</h4>
                        <p className="text-[10px] text-muted-foreground font-medium">Acomodar clientes na mesa</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-white shadow-sm"
                          onClick={() => setOpeningGuests(Math.max(1, openingGuests - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-black w-8 text-center">{openingGuests}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-white shadow-sm"
                          onClick={() => setOpeningGuests(Math.min(selectedTable.capacity + 2, openingGuests + 1))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* DYNAMIC CTAS ACTION BUTTONS GROUP */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-muted/30">
                  {selectedTable.status === "free" && (
                    <>
                      <Button onClick={handleOpenTable} className="col-span-2 h-12 rounded-2xl font-black text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 border-0">
                        <UserPlus className="mr-2 h-4.5 w-4.5" />
                        Abrir e Acomodar
                      </Button>
                      <Button variant="outline" onClick={handleOpenReservation} className="h-11 rounded-2xl font-bold text-xs border-slate-200">
                        <Calendar className="mr-1.5 h-4 w-4 text-slate-500" />
                        Reservar
                      </Button>
                      <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-2xl font-bold text-xs border-slate-200">
                        Voltar
                      </Button>
                    </>
                  )}

                  {selectedTable.status === "occupied" && (
                    <>
                      <Button onClick={handleRequestBill} className="col-span-2 h-12 rounded-2xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 border-0">
                        <Receipt className="mr-2 h-4.5 w-4.5" />
                        Solicitar Conta / Fechar
                      </Button>
                      <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 rounded-2xl font-bold text-xs border-slate-200">
                        Adicionar Pedido KDS
                      </Button>
                      <Button variant="outline" onClick={handleCloseAndFreeTable} className="h-11 rounded-2xl font-bold text-xs border-slate-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                        Liberar Mesa (Forçar)
                      </Button>
                    </>
                  )}

                  {selectedTable.status === "reserved" && (
                    <>
                      <Button onClick={handleOpenTable} className="h-12 rounded-2xl font-black text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md active:scale-95">
                        <Check className="mr-1.5 h-4 w-4 stroke-[3]" />
                        Confirmar Presença
                      </Button>
                      <Button variant="outline" onClick={handleCloseAndFreeTable} className="h-12 rounded-2xl font-bold text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-slate-200">
                        Cancelar Reserva
                      </Button>
                    </>
                  )}

                  {selectedTable.status === "closing" && (
                    <>
                      <Button onClick={handleCloseAndFreeTable} className="col-span-2 h-12 rounded-2xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 border-0">
                        <DollarSign className="mr-1.5 h-4.5 w-4.5 stroke-[2.5]" />
                        Confirmar Pagamento e Desocupar
                      </Button>
                    </>
                  )}
                </div>

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. RESERVATIONS PANEL CREATION DIALOG */}
      <Dialog open={reservationOpen} onOpenChange={setReservationOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-card">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                Criar Reserva Nobre
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Mesa {selectedTable?.number} • Limite: {selectedTable?.capacity} Lugares
              </p>
            </div>
            <button onClick={() => setReservationOpen(false)} className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleSaveReservation} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="res-name" className="text-xs font-bold text-slate-500">Nome do Titular</Label>
              <Input
                id="res-name"
                required
                placeholder="Ex: Dra. Carolina Silva"
                value={resName}
                onChange={(e) => setResName(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="res-time" className="text-xs font-bold text-slate-500">Horário</Label>
                <Input
                  id="res-time"
                  required
                  type="time"
                  value={resTime}
                  onChange={(e) => setResTime(e.target.value)}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="res-size" className="text-xs font-bold text-slate-500">Nº de Convidados</Label>
                <Input
                  id="res-size"
                  required
                  type="number"
                  value={resSize}
                  onChange={(e) => setResSize(Number(e.target.value))}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-phone" className="text-xs font-bold text-slate-500">Telefone de Contato</Label>
              <Input
                id="res-phone"
                placeholder="Ex: (11) 98888-7777"
                value={resPhone}
                onChange={(e) => setResPhone(e.target.value)}
                className="h-11 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md">
                Salvar Reserva e Bloquear Mesa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. EDIT TABLE PROPERTIES DIALOG */}
      <Dialog open={isEditTableOpen} onOpenChange={setIsEditTableOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-card">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Move className="h-5 w-5 text-indigo-500" />
                Editar Mesa {editingTable?.number}
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Modo Design • Ajustar Alocação Física
              </p>
            </div>
            <button onClick={() => setIsEditTableOpen(false)} className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center animate-fade-in">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleUpdateTable} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-num" className="text-xs font-bold text-slate-500">Número da Mesa</Label>
                <Input
                  id="edit-num"
                  required
                  type="number"
                  value={editTableNumber}
                  onChange={(e) => setEditTableNumber(Number(e.target.value))}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-capacity" className="text-xs font-bold text-slate-500">Capacidade (Lugares)</Label>
                <Input
                  id="edit-capacity"
                  required
                  type="number"
                  value={editTableCapacity}
                  onChange={(e) => setEditTableCapacity(Number(e.target.value))}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Formato da Mesa</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["round", "square", "rectangle"] as TableShape[]).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setEditTableShape(shape)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all active:scale-95",
                      editTableShape === shape
                        ? "bg-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-muted/10 border-slate-200 dark:border-muted text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    {shape === "round" ? "Redondo" : shape === "square" ? "Quadrado" : "Retangular"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Setor / Área</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["main", "garden", "vip"] as RoomArea[]).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setEditTableArea(area)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all active:scale-95",
                      editTableArea === area
                        ? "bg-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-muted/10 border-slate-200 dark:border-muted text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    {area === "main" ? "Salão Nobre" : area === "garden" ? "Garden" : "VIP"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t dark:border-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => editingTable && handleDeleteTable(editingTable.id)}
                className="col-span-1 h-11 rounded-xl text-xs font-bold text-rose-500 border-rose-200 dark:border-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-4 w-4 mr-1 shrink-0" />
                Excluir
              </Button>
              <Button type="submit" className="col-span-2 h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. ADD NEW TABLE DIALOG */}
      <Dialog open={isAddTableOpen} onOpenChange={setIsAddTableOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-card">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-500 animate-pulse" />
                Adicionar Nova Mesa
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Alocar novo ponto de consumo no salão
              </p>
            </div>
            <button onClick={() => setIsAddTableOpen(false)} className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center animate-fade-in">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleAddTableSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-num" className="text-xs font-bold text-slate-500">Número da Mesa</Label>
                <Input
                  id="add-num"
                  required
                  type="number"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(Number(e.target.value))}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-capacity" className="text-xs font-bold text-slate-500">Capacidade (Lugares)</Label>
                <Input
                  id="add-capacity"
                  required
                  type="number"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Formato da Mesa</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["round", "square", "rectangle"] as TableShape[]).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setNewTableShape(shape)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all active:scale-95",
                      newTableShape === shape
                        ? "bg-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-muted/10 border-slate-200 dark:border-muted text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    {shape === "round" ? "Redondo" : shape === "square" ? "Quadrado" : "Retangular"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Setor de Alocação</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["main", "garden", "vip"] as RoomArea[]).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setNewTableArea(area)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all active:scale-95",
                      newTableArea === area
                        ? "bg-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-muted/10 border-slate-200 dark:border-muted text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    {area === "main" ? "Salão Nobre" : area === "garden" ? "Garden" : "VIP"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-md">
                Criar e Posicionar Mesa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
