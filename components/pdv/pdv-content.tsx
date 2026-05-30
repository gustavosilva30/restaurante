"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  Ticket,
  ShoppingBag,
  UtensilsCrossed,
  Truck,
  Package,
  Store,
  X,
  Percent,
  Calculator,
  Maximize2,
  Minimize2,
  MessageSquare,
  Clock,
  User,
  Hash,
  ChevronRight,
  Flame,
  Star,
  Zap,
  Split,
  Gift,
  Receipt,
  Printer,
  CheckCircle2,
  ArrowLeft,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  Wifi,
  UserCheck,
  Check,
  Keyboard,
  ShoppingCart,
  LogOut,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSettings, Product } from "@/hooks/use-settings"

type SaleType = "mesa" | "balcao" | "delivery" | "retirada"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  notes?: string
  addons?: { name: string; price: number }[]
}

interface Addon {
  id: string
  name: string
  price: number
}

const saleTypes = [
  { id: "mesa" as const, name: "Mesa", icon: UtensilsCrossed, color: "bg-indigo-500 shadow-indigo-100 dark:shadow-none" },
  { id: "balcao" as const, name: "Balcão", icon: Store, color: "bg-sky-500 shadow-sky-100 dark:shadow-none" },
  { id: "delivery" as const, name: "Delivery", icon: Truck, color: "bg-emerald-500 shadow-emerald-100 dark:shadow-none" },
  { id: "retirada" as const, name: "Retirada", icon: Package, color: "bg-amber-500 shadow-amber-100 dark:shadow-none" },
]

const quickShortcuts = [
  { label: "5%", value: 5 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
]

const mockAddons: Addon[] = [
  { id: "1", name: "Bacon Crispy", price: 6.00 },
  { id: "2", name: "Cheddar Cremoso", price: 5.50 },
  { id: "3", name: "Ovo Frito", price: 3.50 },
  { id: "4", name: "Cebola Caramelizada", price: 4.50 },
  { id: "5", name: "Molho Artesanal", price: 2.50 },
  { id: "6", name: "Batata Frita P", price: 8.00 },
]

const quickNotes = [
  "Sem Cebola",
  "Sem Tomate",
  "Pra Viagem",
  "Bife Bem Passado",
  "Sem Gelo/Limão",
  "Caprichado",
  "Enviar Talheres",
]

const categoryStyles: Record<string, { gradient: string; emoji: string; text: string }> = {
  "1": { gradient: "from-rose-500/10 to-red-500/5 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-950", emoji: "🍛", text: "Pratos" },
  "2": { gradient: "from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-950", emoji: "📦", text: "Marmitas" },
  "3": { gradient: "from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-950", emoji: "🥗", text: "Self-Service" },
  "4": { gradient: "from-sky-500/10 to-blue-500/5 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-950", emoji: "🥤", text: "Bebidas" },
  "5": { gradient: "from-pink-500/10 to-fuchsia-500/5 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-950", emoji: "🍰", text: "Sobremesas" },
  "6": { gradient: "from-orange-500/10 to-amber-500/5 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-950", emoji: "🍔", text: "Lanches" },
}

export function PDVContent() {
  const { products, categories, addons, pdvSettings } = useSettings()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [saleType, setSaleType] = React.useState<SaleType>("balcao")
  const [tableNumber, setTableNumber] = React.useState("")
  const [customerName, setCustomerName] = React.useState("")
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [showPayment, setShowPayment] = React.useState(false)
  const [showAddons, setShowAddons] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [discount, setDiscount] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showNumpad, setShowNumpad] = React.useState(false)
  const [numpadValue, setNumpadValue] = React.useState("")
  const [numpadTarget, setNumpadTarget] = React.useState<"quantity" | "discount" | "table">("quantity")
  const [selectedCartItem, setSelectedCartItem] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [time, setTime] = React.useState("")
  const [isMobileCartOpen, setIsMobileCartOpen] = React.useState(false)
  
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault()
        toggleFullscreen()
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
      if (e.key === "/" && !showPayment) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "F2") {
        e.preventDefault()
        if (cart.length > 0) setShowPayment(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen, cart.length, showPayment])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getProductCountByCategory = (categoryId: string) => {
    if (categoryId === "all") return products.length
    return products.filter(p => p.categoryId === categoryId).length
  }

  const handleProductClick = (product: Product) => {
    if (!product.available) return
    setSelectedProduct(product)
    setShowAddons(true)
  }

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    if (!product.available) return
    addToCart(product, [], "")
  }

  const addToCart = (product: Product, addons: Addon[] = [], notes: string = "") => {
    const itemId = `${product.id}-${Date.now()}`
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0)
    
    setCart((prev) => [
      ...prev,
      {
        id: itemId,
        productId: product.id,
        name: product.name,
        price: product.price + addonTotal,
        quantity: 1,
        notes,
        addons: addons.map(a => ({ name: a.name, price: a.price })),
      },
    ])
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const setQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      )
    }
  }

  const handleAddQuickNote = (id: string, noteText: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentNotes = item.notes ? item.notes.split(", ") : []
          if (currentNotes.includes(noteText)) {
            const updated = currentNotes.filter(n => n !== noteText).join(", ")
            return { ...item, notes: updated || undefined }
          } else {
            currentNotes.push(noteText)
            return { ...item, notes: currentNotes.join(", ") }
          }
        }
        return item
      })
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const serviceFeeAmount = saleType === "mesa" ? subtotal * (pdvSettings.serviceFee / 100) : 0
  const total = subtotal - discountAmount + serviceFeeAmount
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setTableNumber("")
    setCustomerName("")
  }

  const handleNumpadInput = (value: string) => {
    if (value === "clear") {
      setNumpadValue("")
    } else if (value === "backspace") {
      setNumpadValue((prev) => prev.slice(0, -1))
    } else if (value === "confirm") {
      const num = parseInt(numpadValue) || 0
      if (numpadTarget === "quantity" && selectedCartItem) {
        setQuantity(selectedCartItem, num)
      } else if (numpadTarget === "discount") {
        setDiscount(Math.min(100, num))
      } else if (numpadTarget === "table") {
        setTableNumber(numpadValue)
      }
      setShowNumpad(false)
      setNumpadValue("")
      setSelectedCartItem(null)
    } else {
      if (numpadValue.length < 5) {
        setNumpadValue((prev) => prev + value)
      }
    }
  }

  const openNumpad = (target: "quantity" | "discount" | "table", cartItemId?: string) => {
    setNumpadTarget(target)
    setSelectedCartItem(cartItemId || null)
    
    if (target === "discount") {
      setNumpadValue(discount > 0 ? discount.toString() : "")
    } else if (target === "table") {
      setNumpadValue(tableNumber)
    } else if (target === "quantity" && cartItemId) {
      const item = cart.find(i => i.id === cartItemId)
      setNumpadValue(item ? item.quantity.toString() : "")
    } else {
      setNumpadValue("")
    }
    
    setShowNumpad(true)
  }

  // Helper to render dry Cart Layout shared between desktop and mobile drawer
  const renderCartContent = (isMobileView = false) => {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-card">
        {/* Cart Header */}
        <div className="p-4 border-b bg-slate-50/50 dark:bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center shadow-md",
                saleTypes.find(t => t.id === saleType)?.color || "bg-red-500"
              )}>
                {React.createElement(saleTypes.find(t => t.id === saleType)?.icon || Store, {
                  className: "h-4 w-4 text-white"
                })}
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  {saleTypes.find(t => t.id === saleType)?.name}
                  {tableNumber && <span className="text-red-600">#Mesa {tableNumber}</span>}
                </h2>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  {itemCount} {itemCount === 1 ? "item" : "itens"} no pedido
                </p>
              </div>
            </div>
            
            {cart.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
              >
                <Trash2 className="h-4.5 w-4.5 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          {/* Quick Touch Discount */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-muted rounded-xl">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 px-2">Desc:</span>
            {quickShortcuts.map((shortcut) => (
              <button
                key={shortcut.value}
                onClick={() => setDiscount(shortcut.value)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95",
                  discount === shortcut.value
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white dark:bg-card hover:bg-slate-200 dark:hover:bg-muted/80 text-foreground"
                )}
              >
                {shortcut.label}
              </button>
            ))}
            
            <button
              onClick={() => openNumpad("discount")}
              className={cn(
                "p-1 rounded-lg text-xs font-bold bg-white dark:bg-card hover:bg-slate-200 dark:hover:bg-muted/80 text-foreground",
                discount > 0 && !quickShortcuts.some(s => s.value === discount) && "border border-red-500"
              )}
            >
              <Percent className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            </button>

            {discount > 0 && (
              <button
                onClick={() => setDiscount(0)}
                className="ml-auto text-[10px] font-bold text-red-500 hover:underline px-2"
              >
                Remover
              </button>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <ScrollArea className="flex-1 bg-slate-50/30 dark:bg-card/30">
          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center"
                >
                  <ShoppingBag className="h-16 w-16 mb-4 text-slate-300 dark:text-muted animate-pulse" />
                  <p className="font-extrabold text-sm text-slate-700 dark:text-slate-300">Carrinho Vazio</p>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Toque nos produtos ao lado para montar a venda rapidamente.
                  </p>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group rounded-2xl border border-slate-200/80 dark:border-muted/20 bg-white dark:bg-card p-3 shadow-sm hover:border-red-500/20 transition-all duration-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                        {item.quantity}x
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate pr-2">
                            {item.name}
                          </h4>
                          <p className="font-black text-xs text-slate-900 dark:text-slate-100 shrink-0">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                        </div>

                        {item.addons && item.addons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.addons.map((add, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px] bg-slate-50 dark:bg-muted py-0 text-slate-600 dark:text-slate-300 font-semibold border-slate-100">
                                +{add.name} (R$ {add.price.toFixed(2)})
                              </Badge>
                            ))}
                          </div>
                        )}

                        {item.notes && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1.5 bg-amber-500/5 px-2 py-0.5 rounded-lg w-max border border-amber-500/10">
                            <MessageSquare className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[220px]">{item.notes}</span>
                          </div>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-muted/30 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {quickNotes.slice(0, 3).map((note) => {
                              const isAdded = item.notes?.split(", ").includes(note)
                              return (
                                <button
                                  key={note}
                                  onClick={() => handleAddQuickNote(item.id, note)}
                                  className={cn(
                                    "text-[9px] px-2 py-0.5 rounded-lg border font-bold transition-colors",
                                    isAdded
                                      ? "bg-amber-500 border-amber-500 text-white"
                                      : "bg-slate-100 dark:bg-muted hover:bg-slate-200 text-slate-500 dark:text-slate-300 border-transparent"
                                  )}
                                >
                                  {note}
                                </button>
                              )
                            })}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-lg border-slate-200 dark:border-muted/40 shadow-sm"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            
                            <button
                              onClick={() => openNumpad("quantity", item.id)}
                              className="h-7 w-8 flex items-center justify-center font-bold text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-muted border border-slate-200/50"
                            >
                              {item.quantity}
                            </button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-lg border-slate-200 dark:border-muted/40 shadow-sm"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Cart Footer */}
        <div className="border-t bg-slate-50/50 dark:bg-muted/10 p-4 space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            {saleType === "mesa" && pdvSettings.serviceFee > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Taxa de Serviço ({pdvSettings.serviceFee}%)</span>
                <span>R$ {serviceFeeAmount.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-500 font-bold">
                <span>Desconto ({discount}%)</span>
                <span>- R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-200 dark:border-muted/50 text-slate-900 dark:text-slate-50">
              <span>Total Geral</span>
              <motion.span
                key={total}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="text-red-600 dark:text-red-400"
              >
                R$ {total.toFixed(2).replace(".", ",")}
              </motion.span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-2xl border-slate-200 dark:border-muted h-12 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm active:scale-95" 
              disabled={cart.length === 0}
            >
              <Printer className="h-4 w-4 mr-2 text-slate-500" />
              Rascunho
            </Button>
            <Button
              size="lg"
              className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-extrabold h-12 text-xs shadow-lg shadow-red-500/20 active:scale-95 border-0"
              disabled={cart.length === 0}
              onClick={() => {
                if (isMobileView) {
                  setIsMobileCartOpen(false)
                }
                setShowPayment(true)
              }}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Pagar (F2)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground transition-all duration-300 font-sans antialiased",
      isFullscreen && "fixed inset-0 z-50 h-screen w-screen bg-slate-950 dark:bg-background"
    )}>
      {/* 1. Brand & Info Header Bar */}
      <div className="flex shrink-0 items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-slate-900 to-slate-800 dark:from-card dark:to-muted/30 text-white shadow-md">
        <div className="flex items-center gap-3">
          {/* Go to Dashboard/Home Link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-black shadow-sm active:scale-95 transition-transform mr-1 select-none border border-slate-700/50"
            title="Voltar ao Dashboard"
          >
            <Home className="h-4 w-4 text-indigo-400" />
            <span className="hidden sm:inline">Início</span>
          </Link>

          <div className="h-9 w-9 rounded-xl bg-red-600 flex items-center justify-center animate-pulse">
            <span className="font-bold text-white tracking-tighter text-sm">iF</span>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight flex items-center gap-2">
              iFood POS <Badge variant="secondary" className="bg-red-500/20 text-red-400 hover:bg-red-500/20 border-red-500/30 text-[10px] font-bold uppercase">Restaurante</Badge>
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <UserCheck className="h-3 w-3 text-red-400" />
              Caixa: <span className="font-semibold text-slate-200">Operador Admin</span>
            </p>
          </div>
        </div>

        {/* Real-time statuses */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <Wifi className="h-4.5 w-4 text-emerald-400" />
            <span className="font-medium text-slate-200">Sincronizado / Online</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-sm font-bold tracking-widest text-slate-100">{time}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>

          {/* Logout Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-red-500/15 text-slate-300 hover:text-red-400 border border-slate-800 active:scale-95 transition-transform shrink-0"
            onClick={() => router.push("/login")}
            title="Sair do Caixa"
          >
            <LogOut className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>

      {/* Main PDV Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar - Categories */}
        <div className="w-24 sm:w-28 shrink-0 border-r bg-slate-50 dark:bg-muted/10 flex flex-col justify-between py-2">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "w-full flex flex-col items-center gap-1.5 rounded-2xl p-2.5 sm:p-3.5 transition-all relative border border-transparent active:scale-90",
                  selectedCategory === "all"
                    ? "bg-red-600 text-white shadow-xl shadow-red-500/25 border-red-500 font-bold scale-[1.03]"
                    : "hover:bg-slate-200/50 dark:hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-200/80 dark:bg-muted flex items-center justify-center text-lg sm:text-xl shadow-inner group-hover:scale-110 transition-transform">
                  🍔
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-center leading-tight">Todos</span>
                <span className="absolute top-1 right-1 text-[8px] sm:text-[9px] bg-muted-foreground/20 px-1 rounded font-bold">
                  {getProductCountByCategory("all")}
                </span>
              </button>
              
              {categories.map((category) => {
                const style = categoryStyles[category.id] || { gradient: "from-muted to-muted/50", emoji: category.icon, text: category.name }
                const isSelected = selectedCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex flex-col items-center gap-1.5 rounded-2xl p-2.5 sm:p-3.5 transition-all relative border active:scale-90",
                      isSelected
                        ? "bg-red-600 text-white shadow-xl shadow-red-500/20 border-red-500 font-bold scale-[1.03]"
                        : "bg-white dark:bg-card hover:bg-slate-100 dark:hover:bg-muted text-muted-foreground hover:text-foreground border-slate-100 dark:border-transparent"
                    )}
                  >
                    <div className={cn(
                      "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-sm transition-transform",
                      isSelected ? "bg-white/20" : "bg-slate-100 dark:bg-muted"
                    )}>
                      {style.emoji}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-center leading-tight">
                      {category.name}
                    </span>
                    <span className={cn(
                      "absolute top-1 right-1 text-[8px] sm:text-[9px] px-1.5 py-0.25 rounded-md font-bold",
                      isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {getProductCountByCategory(category.id)}
                    </span>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Highly Visual Touch Products Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-100/50 dark:bg-background">
          {/* Top Control Bar */}
          <div className="p-4 border-b bg-background/90 backdrop-blur-md sticky top-0 z-10 shadow-sm flex flex-col gap-3 md:flex-row md:items-center">
            {/* Sale Type Pills */}
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-muted rounded-xl self-start overflow-x-auto max-w-full">
              {saleTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSaleType(type.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 shrink-0",
                    saleType === type.id
                      ? "bg-white dark:bg-card shadow-md text-foreground border border-slate-200/50 dark:border-none"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <type.icon className="h-3.5 w-3.5" />
                  <span>{type.name}</span>
                </button>
              ))}
            </div>

            {/* Sub-inputs based on Sale Type */}
            <div className="flex items-center gap-2">
              {saleType === "mesa" && (
                <button
                  onClick={() => openNumpad("table")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-card border border-red-500/30 hover:border-red-500 transition-colors text-[10px] sm:text-xs font-semibold text-red-600 dark:text-red-400 active:scale-95"
                >
                  <Hash className="h-3.5 w-3.5" />
                  <span>
                    {tableNumber ? `Mesa: ${tableNumber}` : "Selecionar Mesa"}
                  </span>
                </button>
              )}

              {(saleType === "delivery" || saleType === "retirada") && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border bg-white dark:bg-card">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-transparent outline-none text-[10px] sm:text-xs w-28 font-medium"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 hidden md:block" />

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative w-full md:w-52">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Buscar... ( / )"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-7 h-9 bg-white dark:bg-card border border-slate-200 dark:border-muted rounded-xl text-[10px] sm:text-xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Grid/List toggles */}
              <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-muted rounded-lg shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "grid" ? "bg-white dark:bg-card shadow-sm text-red-600" : "text-muted-foreground"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "list" ? "bg-white dark:bg-card shadow-sm text-red-600" : "text-muted-foreground"
                  )}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Touch Products Area */}
          <ScrollArea className="flex-1 p-4 pb-20 lg:pb-4">
            <div className={cn(
              "grid gap-3 sm:gap-4",
              viewMode === "grid" 
                ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => {
                  const style = categoryStyles[product.categoryId] || { gradient: "from-slate-100 to-slate-200 text-slate-800", emoji: "🍽️" }
                  const countInCart = cart.filter(i => i.productId === product.id).reduce((sum, item) => sum + item.quantity, 0)
                  
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.15) }}
                    >
                      {viewMode === "grid" ? (
                        <button
                          onClick={() => handleProductClick(product)}
                          disabled={!product.available}
                          className={cn(
                            "w-full text-left group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 dark:border-muted/30 bg-white dark:bg-card transition-all duration-200 h-[200px] sm:h-[220px] shadow-sm select-none",
                            product.available
                              ? "hover:shadow-md hover:border-red-500/40 hover:-translate-y-1 active:scale-[0.97]"
                              : "opacity-40 cursor-not-allowed"
                          )}
                        >
                          <div className={cn(
                            "h-20 sm:h-24 w-full bg-gradient-to-br relative flex items-center justify-center border-b border-slate-100 dark:border-muted/30",
                            style.gradient
                          )}>
                            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-50 group-hover:scale-125 transition-transform duration-300 rounded-b-3xl" />
                            
                            <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300 z-10">
                              {style.emoji}
                            </span>

                            {countInCart > 0 && (
                              <span className="absolute top-2 right-2 bg-red-600 text-white font-black text-[10px] sm:text-xs h-5.5 w-5.5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                                {countInCart}
                              </span>
                            )}

                            {product.price > 40 && (
                              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[8px] font-extrabold uppercase shadow-sm">
                                <Flame className="h-2.5 w-2.5 mr-0.5" />
                                Popular
                              </Badge>
                            )}

                            {product.available && (
                              <Button
                                onClick={(e) => handleQuickAdd(e, product)}
                                className="absolute bottom-2 right-2 h-7 w-7 rounded-lg bg-white text-slate-800 hover:bg-red-600 hover:text-white shadow-md p-0 flex items-center justify-center border border-slate-200/50"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="p-3 flex flex-col justify-between flex-1">
                            <div>
                              <h3 className="font-bold text-[11px] sm:text-xs text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-red-600 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-tight font-medium">
                                {product.description || "Ingredientes artesanais frescos selecionados."}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-50">
                                R$ {product.price.toFixed(2).replace(".", ",")}
                              </span>
                              <span className="text-[8px] sm:text-[9px] bg-slate-100 dark:bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-bold uppercase">
                                {style.text}
                              </span>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProductClick(product)}
                          disabled={!product.available}
                          className={cn(
                            "w-full flex items-center gap-3 p-2.5 rounded-2xl border border-slate-100 dark:border-muted/20 bg-white dark:bg-card transition-all active:scale-[0.99]",
                            product.available
                              ? "hover:shadow-sm hover:border-red-500/30"
                              : "opacity-40 cursor-not-allowed"
                          )}
                        >
                          <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner",
                            style.gradient
                          )}>
                            {style.emoji}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">{product.name}</h3>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{product.description}</p>
                          </div>
                          
                          {countInCart > 0 && (
                            <Badge className="bg-red-600 text-white font-extrabold rounded-full px-1.5 py-0 text-[10px]">
                              {countInCart}x
                            </Badge>
                          )}

                          <div className="text-right shrink-0">
                            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                          <Button
                            onClick={(e) => handleQuickAdd(e, product)}
                            className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-muted text-slate-800 dark:text-slate-100 hover:bg-red-600 hover:text-white p-0 border border-slate-200/50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Quick Keyboard shortcuts bar */}
          <div className="p-2 border-t bg-white dark:bg-card hidden md:flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Keyboard className="h-3.5 w-3.5" /> Atalhos:
            </span>
            <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-slate-300 font-mono shadow-sm bg-slate-50 dark:bg-muted/30">F2 Pagamento</Badge>
            <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-slate-300 font-mono shadow-sm bg-slate-50 dark:bg-muted/30">F11 Tela Cheia</Badge>
            <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-slate-300 font-mono shadow-sm bg-slate-50 dark:bg-muted/30">/ Buscar</Badge>
          </div>
        </div>

        {/* 2. Right Side - Desktop Smart Cart */}
        <div className="hidden lg:flex w-[400px] shrink-0 border-l bg-white dark:bg-card flex-col shadow-2xl relative z-10">
          {renderCartContent(false)}
        </div>

      </div>

      {/* 3. MOBILE FLOATING CART ACTIONS BOTTOM BAR */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <Button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full rounded-2xl h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black text-sm shadow-xl flex items-center justify-between px-6 border-none active:scale-[0.97] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 h-6.5 w-6.5 rounded-lg text-xs font-black flex items-center justify-center text-white shrink-0 shadow-inner">
                {itemCount}
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingCart className="h-4.5 w-4.5" /> Ver Pedido
              </span>
            </div>
            <span className="font-extrabold text-sm">R$ {total.toFixed(2).replace(".", ",")}</span>
          </Button>
        </div>
      )}

      {/* 4. MOBILE SLIDE-UP CART DRAWER DIALOG */}
      <Dialog open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-t-[32px] border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] max-h-[85vh] h-[650px]">
          {renderCartContent(true)}
        </DialogContent>
      </Dialog>

      {/* Addons Selection Dialog */}
      <AddonsDialog
        open={showAddons}
        onOpenChange={setShowAddons}
        product={selectedProduct}
        addons={addons}
        onConfirm={(addons, notes) => {
          if (selectedProduct) {
            addToCart(selectedProduct, addons, notes)
          }
          setShowAddons(false)
          setSelectedProduct(null)
        }}
      />

      {/* Modern Split Payments Dialog */}
      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        total={total}
        saleType={saleType}
        tableNumber={tableNumber}
        customerName={customerName}
        onComplete={() => {
          clearCart()
          setShowPayment(false)
        }}
      />

      {/* Numpad Virtual Keypad Dialog */}
      <NumpadDialog
        open={showNumpad}
        onOpenChange={setShowNumpad}
        value={numpadValue}
        onInput={handleNumpadInput}
        title={
          numpadTarget === "quantity" ? "Definir Quantidade" :
          numpadTarget === "discount" ? "Lançar Desconto (%)" :
          "Número da Mesa"
        }
      />
    </div>
  )
}

// ----------------------------------------------------
// 1. ADDONS DIALOG COMPONENT
// ----------------------------------------------------
interface AddonsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: typeof mockProducts[0] | null
  addons: Addon[]
  onConfirm: (addons: Addon[], notes: string) => void
}

function AddonsDialog({ open, onOpenChange, product, addons, onConfirm }: AddonsDialogProps) {
  const [selectedAddons, setSelectedAddons] = React.useState<Addon[]>([])
  const [notes, setNotes] = React.useState("")
  const [quantity, setQuantity] = React.useState(1)

  React.useEffect(() => {
    if (open) {
      setSelectedAddons([])
      setNotes("")
      setQuantity(1)
    }
  }, [open])

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const itemTotal = ((product?.price || 0) + addonTotal) * quantity

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden rounded-t-[32px] border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[480px] sm:rounded-3xl max-h-[85vh] sm:h-auto overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white flex justify-between items-center relative">
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">{product.name}</h2>
            <p className="text-[10px] text-red-100 font-semibold uppercase tracking-wider mt-0.5">Customize seu pedido</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full bg-black/10 text-white hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <ScrollArea className="max-h-[50vh] sm:max-h-[500px] overflow-y-auto">
          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            <div className="flex justify-between items-center p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
              <span className="text-xs font-bold text-red-600 dark:text-red-400">Preço Unitário</span>
              <span className="text-lg font-black text-red-600 dark:text-red-400">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Adicionais
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.find((a) => a.id === addon.id)
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={cn(
                        "flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.97]",
                        isSelected
                          ? "border-red-500 bg-red-500/5 text-red-600 font-bold dark:text-red-400"
                          : "border-slate-100 dark:border-muted hover:border-slate-300 dark:hover:border-muted/50 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-muted/20"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold truncate max-w-[100px]">{addon.name}</span>
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">+ R$ {addon.price.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center border",
                        isSelected ? "bg-red-600 border-red-600 text-white" : "border-slate-300"
                      )}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Observações Rápidas
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {quickNotes.map((note) => {
                  const isAdded = notes.split(", ").includes(note)
                  return (
                    <button
                      key={note}
                      onClick={() => {
                        const arr = notes ? notes.split(", ") : []
                        if (arr.includes(note)) {
                          const updated = arr.filter(n => n !== note).join(", ")
                          setNotes(updated)
                        } else {
                          arr.push(note)
                          setNotes(arr.join(", "))
                        }
                      }}
                      className={cn(
                        "text-[10px] sm:text-xs px-2.5 py-1 rounded-xl border-2 font-bold transition-all active:scale-95",
                        isAdded
                          ? "bg-amber-500 border-amber-500 text-white shadow-md"
                          : "bg-slate-50 dark:bg-muted/20 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-muted hover:border-slate-300"
                      )}
                    >
                      {note}
                    </button>
                  )
                })}
              </div>

              <Textarea
                placeholder="Escreva observações personalizadas aqui..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none rounded-xl text-xs mt-2 border-slate-200 dark:border-muted"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-muted/30 rounded-2xl border border-slate-200/50 dark:border-muted/30">
              <div>
                <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300">Quantidade</span>
                <p className="text-[10px] text-muted-foreground font-medium">Quantos deste item</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-white shadow-sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-base sm:text-lg font-black w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-white shadow-sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-5 sm:p-6 border-t bg-slate-50/50 dark:bg-muted/10">
          <Button
            size="lg"
            className="w-full rounded-2xl h-12 text-xs sm:text-sm font-extrabold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/20 active:scale-95 border-0"
            onClick={() => {
              onConfirm(selectedAddons, notes)
            }}
          >
            Confirmar e Adicionar • R$ {itemTotal.toFixed(2).replace(".", ",")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------
// 2. MULTIPLE PAYMENTS & SPLIT DIALOG
// ----------------------------------------------------
interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  saleType: SaleType
  tableNumber: string
  customerName: string
  onComplete: () => void
}

interface PaymentParcel {
  methodId: string
  amount: number
  methodName: string
  color: string
}

function PaymentDialog({ open, onOpenChange, total, saleType, tableNumber, customerName, onComplete }: PaymentDialogProps) {
  const [parcels, setParcels] = React.useState<PaymentParcel[]>([])
  const [cashReceived, setCashReceived] = React.useState("")
  const [currentMethodId, setCurrentMethodId] = React.useState<string | null>(null)
  const [step, setStep] = React.useState<"method" | "cash" | "success">("method")
  
  React.useEffect(() => {
    if (open) {
      setParcels([])
      setCashReceived("")
      setCurrentMethodId(null)
      setStep("method")
    }
  }, [open])

  const paymentMethods = [
    { id: "pix", name: "PIX QR Code", icon: QrCode, color: "bg-emerald-500 shadow-emerald-100" },
    { id: "credit", name: "C. Crédito", icon: CreditCard, color: "bg-blue-500 shadow-blue-100" },
    { id: "debit", name: "C. Débito", icon: CreditCard, color: "bg-indigo-500 shadow-indigo-100" },
    { id: "cash", name: "Dinheiro", icon: Banknote, color: "bg-amber-500 shadow-amber-100" },
    { id: "voucher", name: "Alimentação", icon: Ticket, color: "bg-rose-500 shadow-rose-100" },
  ]

  const totalPaid = parcels.reduce((sum, p) => sum + p.amount, 0)
  const remainingAmount = Math.max(0, total - totalPaid)
  const isFullyPaid = remainingAmount <= 0.01

  const selectPaymentMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId)
    if (!method) return

    if (methodId === "cash") {
      setCurrentMethodId(methodId)
      setCashReceived(remainingAmount.toFixed(2))
      setStep("cash")
    } else {
      addParcel(methodId, remainingAmount, method.name, method.color)
    }
  }

  const addParcel = (methodId: string, amount: number, name: string, color: string) => {
    setParcels(prev => [...prev, { methodId, amount, methodName: name, color }])
    const nextPaid = totalPaid + amount
    if (nextPaid >= total - 0.01) {
      setStep("success")
    } else {
      setStep("method")
    }
  }

  const handleCashConfirm = () => {
    const cashVal = Number(cashReceived) || 0
    if (cashVal <= 0) return

    const method = paymentMethods.find(m => m.id === "cash")
    if (!method) return

    const finalRegisteredAmount = Math.min(cashVal, remainingAmount)
    addParcel("cash", finalRegisteredAmount, method.name, method.color)
  }

  const currentCashInput = Number(cashReceived) || 0
  const cashChange = Math.max(0, currentCashInput - remainingAmount)

  const quickCashAmounts = [10, 20, 50, 100, 200].filter(a => a >= remainingAmount)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden rounded-t-[32px] border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[480px] sm:rounded-3xl max-h-[85vh] overflow-y-auto">
        <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <Calculator className="h-5 w-5 text-red-500" />
              {step === "success" ? "Venda Concluída!" : "Caixa / Pagamento"}
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {saleType === "mesa" && `Mesa ${tableNumber}`}
              {saleType === "balcao" && "Balcão"}
              {(saleType === "delivery" || saleType === "retirada") && customerName && `Cliente: ${customerName}`}
            </p>
          </div>
          {step !== "success" && (
            <button
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === "method" && (
            <motion.div
              key="method"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-5 sm:p-6 space-y-5"
            >
              <div className="bg-slate-50 dark:bg-muted/20 p-4.5 rounded-2xl border border-slate-100 dark:border-muted flex justify-between items-center">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500">Valor do Pedido</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">R$ {total.toFixed(2).replace(".", ",")}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-red-500">Restante</span>
                  <p className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400">R$ {remainingAmount.toFixed(2).replace(".", ",")}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] sm:text-[10px] font-extrabold uppercase text-muted-foreground">
                  <span>Progresso</span>
                  <span>{((totalPaid / total) * 100).toFixed(0)}% Pago</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-muted rounded-full overflow-hidden shadow-inner flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalPaid / total) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
              </div>

              {parcels.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400">Parcelas Recebidas</h4>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                    {parcels.map((parcel, idx) => (
                      <div key={idx} className="flex justify-between items-center px-3 py-2 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/15">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full", parcel.color)} />
                          <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">{parcel.methodName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">R$ {parcel.amount.toFixed(2).replace(".", ",")}</span>
                          <button
                            onClick={() => setParcels(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 text-xs p-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-[9px] sm:text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Selecione o Meio</h4>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => selectPaymentMethod(method.id)}
                      className="flex items-center gap-2.5 p-3 bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-muted/40 border border-slate-200 dark:border-muted rounded-2xl text-left transition-all active:scale-[0.96] shadow-sm"
                    >
                      <div className={cn("h-8.5 w-8.5 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md", method.color)}>
                        <method.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate block">{method.name}</span>
                        <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">Registrar</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === "cash" && (
            <motion.div
              key="cash"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5 sm:p-6 space-y-4.5"
            >
              <button
                onClick={() => setStep("method")}
                className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Banknote className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Dinheiro • Recebimento</h3>
              </div>

              <div className="bg-slate-100 dark:bg-muted/20 p-4 rounded-xl border text-center">
                <span className="text-[8px] sm:text-[9px] font-extrabold uppercase text-slate-400">Restante para quitar</span>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">R$ {remainingAmount.toFixed(2).replace(".", ",")}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-500">Cédulas Entregues (R$)</label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="h-12 text-lg font-black text-center rounded-xl border-slate-200 dark:border-muted bg-white dark:bg-card"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quickCashAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setCashReceived(amount.toFixed(2))}
                    className="rounded-xl h-9 text-xs font-bold"
                  >
                    R$ {amount}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCashReceived(remainingAmount.toFixed(2))}
                  className="rounded-xl h-9 text-xs font-bold border-red-500/20 text-red-600 bg-red-500/5 hover:bg-red-500/10"
                >
                  Exato
                </Button>
              </div>

              {cashChange > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
                >
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Troco</span>
                  <p className="text-xl font-black text-emerald-500">R$ {cashChange.toFixed(2).replace(".", ",")}</p>
                </motion.div>
              )}

              <Button
                size="lg"
                className="w-full h-12 rounded-2xl font-extrabold text-xs bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-95 border-0"
                disabled={!cashReceived || Number(cashReceived) < remainingAmount - 0.01}
                onClick={handleCashConfirm}
              >
                Confirmar Recebimento
              </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center space-y-5"
            >
              <div className="h-14 w-14 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5] animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Venda Finalizada!</h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground">Pedido enviado para impressão e produção.</p>
              </div>

              <div className="bg-slate-50 dark:bg-muted/20 p-4 rounded-2xl border border-slate-100 dark:border-muted text-center space-y-0.5">
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">Total Recebido</span>
                <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">R$ {total.toFixed(2).replace(".", ",")}</p>
              </div>

              <div className="space-y-1.5 text-left">
                <h5 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Recibo</h5>
                <div className="bg-slate-50 dark:bg-muted/10 p-3 rounded-xl space-y-1 text-xs">
                  {parcels.map((p, i) => (
                    <div key={i} className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>{p.methodName}</span>
                      <span className="font-bold">R$ {p.amount.toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <Button variant="outline" className="flex-1 rounded-2xl h-11 text-xs font-bold" onClick={onComplete}>
                  <Receipt className="h-4 w-4 mr-1.5" />
                  Cupom
                </Button>
                <Button className="flex-1 rounded-2xl h-11 text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white" onClick={onComplete}>
                  <Zap className="h-4 w-4 mr-1.5" />
                  Nova Venda
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// ----------------------------------------------------
// 3. NUMPAD DIALOG COMPONENT
// ----------------------------------------------------
interface NumpadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onInput: (value: string) => void
  title: string
}

function NumpadDialog({ open, onOpenChange, value, onInput, title }: NumpadDialogProps) {
  const buttons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "clear", "0", "backspace",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-5 overflow-hidden rounded-t-[32px] border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[320px] sm:rounded-3xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xs sm:text-sm font-black text-center flex items-center gap-1.5 justify-center">
            <Calculator className="h-4.5 w-4.5 text-red-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="p-3.5 bg-slate-100 dark:bg-muted rounded-2xl text-center border shadow-inner">
            <p className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-slate-800 dark:text-slate-100">
              {value || "0"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {buttons.map((btn) => (
              <Button
                key={btn}
                variant={btn === "clear" || btn === "backspace" ? "outline" : "secondary"}
                size="lg"
                className={cn(
                  "h-12 text-sm font-bold rounded-2xl active:scale-90 transition-transform shadow-sm",
                  btn === "clear" && "text-red-500 hover:text-red-600 border-red-200 bg-red-500/5",
                  btn === "backspace" && "text-slate-600 dark:text-slate-300"
                )}
                onClick={() => onInput(btn)}
              >
                {btn === "clear" ? "Limpar" : btn === "backspace" ? "←" : btn}
              </Button>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full h-12 rounded-2xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-95 border-0"
            onClick={() => onInput("confirm")}
          >
            Confirmar e Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
