"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  CreditCard,
  Plug,
  Printer,
  FileText,
  MessageSquare,
  Building2,
  ChevronRight,
  Check,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Layers,
  ArrowRight,
  Wifi,
  Settings,
  Sliders,
  Search,
  BadgeAlert,
  Save,
  Package,
  PlusCircle,
  HelpCircle,
  FolderPlus,
  UtensilsCrossed,
  Info,
  Terminal,
  Lock,
  Play,
  RefreshCw,
  AlertTriangle,
  History,
  ArrowLeft,
  Activity,
  HeartPulse,
  Smartphone,
  Send,
  Bot,
  MessageCircle,
  Database,
  CheckCircle2,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { mockUsers } from "@/lib/mock-data"
import { AppLayout } from "@/components/layout/app-layout"
import { useSettings, Product, Category, Ingredient, Addon } from "@/hooks/use-settings"
import { useIFood } from "@/hooks/use-ifood"
import { useWhatsApp } from "@/hooks/use-whatsapp"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const settingSections = [
  { id: "multi-tenant", name: "Multiempresa & Filiais", description: "Gerenciar filiais e SaaS", icon: Building2 },
  { id: "catalog", name: "Catálogo de Produtos", description: "Gerenciar produtos e categorias", icon: Layers },
  { id: "inventory", name: "Estoque & Adicionais", description: "Ingredientes e opcionais", icon: Sparkles },
  { id: "system-params", name: "Parâmetros do Sistema", description: "Configurar PDV, KDS e Delivery", icon: Sliders },
  { id: "users", name: "Usuários", description: "Gerenciar usuários e acesso", icon: Users },
  { id: "plans", name: "Planos & Faturamento", description: "Gerenciar assinatura SaaS", icon: CreditCard },
  { id: "integrations", name: "Integrações & APIs", description: "Conectar iFood e WhatsApp", icon: Plug },
]

const integrationsList = [
  { id: "1", name: "iFood POS API", status: "connected", icon: "🍔", description: "Integração automática de cardápio e recebimento de pedidos em tempo real." },
  { id: "2", name: "Rappi Delivery", status: "disconnected", icon: "🛵", description: "Envie seus produtos e receba taxas especiais para frotas integradas." },
  { id: "3", name: "Uber Eats Delivery", status: "disconnected", icon: "🚗", description: "Recebimento de chamados e roteirização avançada com Uber Direct." },
  { id: "4", name: "WhatsApp Cloud Business", status: "connected", icon: "💬", description: "Envio de status do KDS (Pronto/Saiu para entrega) direto no celular do cliente." },
  { id: "5", name: "Stone Pagamentos", status: "connected", icon: "💳", description: "Conciliação automática de taxas de cartões e PIX direto no painel financeiro." },
]

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: "Administrador", color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
  manager: { label: "Gerente", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  cashier: { label: "Caixa", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  waiter: { label: "Garçom", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  kitchen: { label: "Cozinha", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
}

interface Branch {
  id: string
  name: string
  location: string
  plan: string
  revenue: string
  isActiveContext: boolean
}

export default function ConfiguracoesPage() {
  const {
    products,
    categories,
    inventory,
    addons,
    pdvSettings,
    kdsSettings,
    deliverySettings,
    
    addProduct,
    editProduct,
    deleteProduct,
    
    addCategory,
    editCategory,
    deleteCategory,
    
    addIngredient,
    editIngredient,
    deleteIngredient,
    updateIngredientStock,
    
    addAddon,
    deleteAddon,
    
    updatePdvSettings,
    updateKdsSettings,
    updateDeliverySettings,
  } = useSettings()

  const ifood = useIFood()
  const [isIFoodConfiguring, setIsIFoodConfiguring] = React.useState(false)
  const [isWhatsAppConfiguring, setIsWhatsAppConfiguring] = React.useState(false)
  const wpp = useWhatsApp()

  const [activeTab, setActiveTab] = React.useState("multi-tenant")
  
  // Multi-tenant sub tabs: 'filiais' | 'limites' | 'marca'
  const [tenantSubTab, setTenantSubTab] = React.useState<"filiais" | "limites" | "marca">("filiais")

  // Branches list state
  const [branches, setBranches] = React.useState<Branch[]>([
    { id: "b1", name: "Restaurante Sabor & Arte - Matriz", location: "São Paulo, SP - Av. Paulista", plan: "Chef Gourmet Enterprise", revenue: "R$ 12.450,00", isActiveContext: true },
    { id: "b2", name: "Restaurante Sabor & Arte - Filial Jardins", location: "São Paulo, SP - Alameda Santos", plan: "Chef Gourmet Enterprise", revenue: "R$ 8.900,00", isActiveContext: false },
    { id: "b3", name: "Restaurante Sabor & Arte - Express", location: "Campinas, SP - Shopping Dom Pedro", plan: "Chef Profissional", revenue: "R$ 4.200,00", isActiveContext: false },
  ])

  // New branch modal state
  const [newBranchOpen, setNewBranchOpen] = React.useState(false)
  const [nbName, setNbName] = React.useState("")
  const [nbLocation, setNbLocation] = React.useState("")
  const [nbPlan, setNbPlan] = React.useState("Chef Profissional")

  // Corporate theme states
  const [brandColor, setBrandColor] = React.useState<"indigo" | "red" | "emerald" | "amber">("indigo")
  const [subdomain, setSubdomain] = React.useState("saborearte")
  const [dnsStatus, setDnsStatus] = React.useState<"idle" | "verifying" | "propagated">("idle")

  const activeBranch = branches.find(b => b.isActiveContext) || branches[0]

  // Search & filters inside Catalog tab
  const [catalogSearch, setCatalogSearch] = React.useState("")
  const [catalogCategoryFilter, setCatalogCategoryFilter] = React.useState("all")

  // Edit / Add product modal state
  const [productModalOpen, setProductModalOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [prodName, setProdName] = React.useState("")
  const [prodPrice, setProdPrice] = React.useState("")
  const [prodCat, setProdCat] = React.useState("")
  const [prodDesc, setProdDesc] = React.useState("")
  const [prodAvailable, setProdAvailable] = React.useState(true)

  // Edit / Add category modal state
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [catName, setCatName] = React.useState("")
  const [catIcon, setCatIcon] = React.useState("🍔")
  const [catColor, setCatColor] = React.useState("#ef4444")

  // Edit / Add ingredient modal state
  const [ingredientModalOpen, setIngredientModalOpen] = React.useState(false)
  const [editingIngredient, setEditingIngredient] = React.useState<Ingredient | null>(null)
  const [ingName, setIngName] = React.useState("")
  const [ingUnit, setIngUnit] = React.useState("kg")
  const [ingQty, setIngQty] = React.useState("")
  const [ingMinQty, setIngMinQty] = React.useState("")
  const [ingPrice, setIngPrice] = React.useState("")
  const [ingSupplier, setIngSupplier] = React.useState("")

  // Add Addon state
  const [addonName, setAddonName] = React.useState("")
  const [addonPrice, setAddonPrice] = React.useState("")

  // Switch context of branch trigger
  const handleSwitchBranchContext = (id: string) => {
    setBranches(prev =>
      prev.map(b => ({
        ...b,
        isActiveContext: b.id === id
      }))
    )
  }

  // Handle adding new branch
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nbName || !nbLocation) return

    const newB: Branch = {
      id: `b-${Date.now()}`,
      name: nbName,
      location: nbLocation,
      plan: nbPlan,
      revenue: "R$ 0,00",
      isActiveContext: false
    }

    setBranches(prev => [...prev, newB])
    setNewBranchOpen(false)
    setNbName("")
    setNbLocation("")
  }

  // DNS Verification simulator
  const handleVerifyDns = () => {
    setDnsStatus("verifying")
    setTimeout(() => {
      setDnsStatus("propagated")
    }, 1200)
  }

  // Catalog Actions handlers
  const openProductAdd = () => {
    setEditingProduct(null)
    setProdName("")
    setProdPrice("")
    setProdCat(categories[0]?.id || "1")
    setProdDesc("")
    setProdAvailable(true)
    setProductModalOpen(true)
  }

  const openProductEdit = (product: Product) => {
    setEditingProduct(product)
    setProdName(product.name)
    setProdPrice(product.price.toString())
    setProdCat(product.categoryId)
    setProdDesc(product.description)
    setProdAvailable(product.available)
    setProductModalOpen(true)
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pPrice = parseFloat(prodPrice.replace(",", ".")) || 0
    
    if (editingProduct) {
      editProduct(editingProduct.id, {
        name: prodName,
        price: pPrice,
        categoryId: prodCat,
        description: prodDesc,
        available: prodAvailable
      })
    } else {
      addProduct({
        name: prodName,
        price: pPrice,
        categoryId: prodCat,
        description: prodDesc,
        available: prodAvailable
      })
    }
    setProductModalOpen(false)
  }

  // Category Actions handlers
  const openCategoryAdd = () => {
    setEditingCategory(null)
    setCatName("")
    setCatIcon("🍔")
    setCatColor("#ef4444")
    setCategoryModalOpen(true)
  }

  const openCategoryEdit = (category: Category) => {
    setEditingCategory(category)
    setCatName(category.name)
    setCatIcon(category.icon)
    setCatColor(category.color)
    setCategoryModalOpen(true)
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      editCategory(editingCategory.id, {
        name: catName,
        icon: catIcon,
        color: catColor
      })
    } else {
      addCategory({
        name: catName,
        icon: catIcon,
        color: catColor
      })
    }
    setCategoryModalOpen(false)
  }

  // Ingredient Actions handlers
  const openIngredientAdd = () => {
    setEditingIngredient(null)
    setIngName("")
    setIngUnit("kg")
    setIngQty("")
    setIngMinQty("")
    setIngPrice("")
    setIngSupplier("")
    setIngredientModalOpen(true)
  }

  const openIngredientEdit = (ing: Ingredient) => {
    setEditingIngredient(ing)
    setIngName(ing.name)
    setIngUnit(ing.unit)
    setIngQty(ing.quantity.toString())
    setIngMinQty(ing.minQuantity.toString())
    setIngPrice(ing.price.toString())
    setIngSupplier(ing.supplier)
    setIngredientModalOpen(true)
  }

  const handleIngredientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const qty = parseFloat(ingQty) || 0
    const minQty = parseFloat(ingMinQty) || 0
    const price = parseFloat(ingPrice) || 0

    if (editingIngredient) {
      editIngredient(editingIngredient.id, {
        name: ingName,
        unit: ingUnit,
        quantity: qty,
        minQuantity: minQty,
        price,
        supplier: ingSupplier
      })
    } else {
      addIngredient({
        name: ingName,
        unit: ingUnit,
        quantity: qty,
        minQuantity: minQty,
        price,
        supplier: ingSupplier
      })
    }
    setIngredientModalOpen(false)
  }

  // Addon submission
  const handleAddonAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addonName || !addonPrice) return
    const price = parseFloat(addonPrice.replace(",", ".")) || 0
    addAddon({
      name: addonName,
      price
    })
    setAddonName("")
    setAddonPrice("")
  }

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(catalogSearch.toLowerCase())
    const matchesCategory = catalogCategoryFilter === "all" || p.categoryId === catalogCategoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <AppLayout title="Configurações">
      <div className="flex flex-col gap-6 lg:flex-row relative">
        
        {/* Settings Navigation Sidebar */}
        <Card className="lg:w-80 shrink-0 rounded-3xl border-slate-200/60 dark:border-muted/30 shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50 dark:bg-muted/10 p-5">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-indigo-500" />
              Opções Gerais
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Ajuste o ecossistema SaaS</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <nav className="space-y-1">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all active:scale-[0.98]",
                    activeTab === section.id
                      ? "bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-500/20"
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <section.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs tracking-tight">{section.name}</p>
                    <p className={cn("text-[9px] truncate font-medium mt-0.5", activeTab === section.id ? "text-indigo-100" : "text-muted-foreground")}>
                      {section.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Dynamic Settings Content Panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* 1. SAAS MULTI-TENANT & BRANCHES PANEL */}
            {activeTab === "multi-tenant" && (
              <motion.div
                key="multi-tenant"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Visual Branch Switcher and tabs header */}
                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                  <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
                            Painel Multiempresa & Franquias
                          </CardTitle>
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                            Filial Ativa: <span className="text-indigo-600 dark:text-indigo-400 font-black">{activeBranch.name}</span>
                          </p>
                        </div>
                      </div>

                      {/* Sub tab selectors */}
                      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-muted rounded-2xl border w-max self-start sm:self-center">
                        <button
                          onClick={() => setTenantSubTab("filiais")}
                          className={cn(
                            "px-3.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                            tenantSubTab === "filiais" ? "bg-white dark:bg-card shadow-sm text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Filiais
                        </button>
                        <button
                          onClick={() => setTenantSubTab("limites")}
                          className={cn(
                            "px-3.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                            tenantSubTab === "limites" ? "bg-white dark:bg-card shadow-sm text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Limites & Uso
                        </button>
                        <button
                          onClick={() => setTenantSubTab("marca")}
                          className={cn(
                            "px-3.5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                            tenantSubTab === "marca" ? "bg-white dark:bg-card shadow-sm text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Personalização
                        </button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                      
                      {/* SUB TAB 1: BRANCH LIST & SWITCHER */}
                      {tenantSubTab === "filiais" && (
                        <motion.div
                          key="filiais"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-sm text-slate-500 uppercase tracking-widest">Suas Filiais / Lojas</h3>
                            <Button 
                              onClick={() => setNewBranchOpen(true)}
                              className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 px-4 shadow-md shadow-indigo-500/15 border-0"
                            >
                              <Plus className="mr-1.5 h-4 w-4 stroke-[3]" />
                              Nova Filial
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {branches.map((branch) => (
                              <div
                                key={branch.id}
                                className={cn(
                                  "group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl border transition-all duration-200",
                                  branch.isActiveContext
                                    ? "bg-indigo-500/5 border-indigo-500/35 shadow-sm"
                                    : "bg-slate-50/50 dark:bg-card/20 border-slate-200/60 dark:border-muted/30 hover:border-slate-300"
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={cn(
                                    "p-2.5 rounded-2xl shrink-0 shadow-md",
                                    branch.isActiveContext ? "bg-indigo-600 text-white shadow-indigo-500/20" : "bg-slate-100 dark:bg-muted text-slate-500"
                                  )}>
                                    <Building2 className="h-5.5 w-5.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-none">{branch.name}</h4>
                                      {branch.isActiveContext && (
                                        <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white font-black text-[9px] uppercase h-5">Ativa</Badge>
                                      )}
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-1">{branch.location}</p>
                                    <p className="text-[10px] text-indigo-500 font-extrabold mt-1 uppercase tracking-wide">Plano: {branch.plan}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-5 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                                  <div className="text-left md:text-right">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Faturamento Hoje</span>
                                    <p className="font-black text-sm text-slate-900 dark:text-slate-100 mt-0.5">{branch.revenue}</p>
                                  </div>

                                  {!branch.isActiveContext ? (
                                    <Button
                                      variant="outline"
                                      onClick={() => handleSwitchBranchContext(branch.id)}
                                      className="rounded-2xl h-10 text-xs font-black border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors shadow-sm"
                                    >
                                      Ativar Contexto
                                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                  ) : (
                                    <div className="h-10 w-28 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-extrabold text-xs gap-1.5 select-none border border-indigo-500/10">
                                      <Check className="h-4 w-4 stroke-[3]" />
                                      Ativa no Caixa
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* SUB TAB 2: SAAS METRIC LIMITS & BILLING */}
                      {tenantSubTab === "limites" && (
                        <motion.div
                          key="limites"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex justify-between items-center text-xs">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Seu Plano Multiempresa</span>
                              <p className="font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{activeBranch.plan}</p>
                            </div>
                            <span className="text-xl font-black text-slate-800 dark:text-slate-100">R$ 399,00<span className="text-xs font-normal text-muted-foreground">/mês</span></span>
                          </div>

                          {/* Seeding usage counts gauges */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Limites de Consumo de Recursos</h4>
                            
                            {[
                              { label: "Mesas Físicas Simultâneas", current: 8, max: 20, color: "bg-indigo-600" },
                              { label: "Usuários Cadastrados", current: 5, max: 10, color: "bg-indigo-600" },
                              { label: "Notas Fiscais Emitidas / Mês", current: 150, max: 500, color: "bg-indigo-600" },
                              { label: "Integrações Delivery Ativas", current: 2, max: 3, color: "bg-indigo-600" },
                            ].map((limit, idx) => (
                              <div key={idx} className="space-y-1.5 font-bold text-xs">
                                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                                  <span>{limit.label}</span>
                                  <span>{limit.current} de {limit.max} utilizados</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 dark:bg-muted rounded-full overflow-hidden flex shadow-inner">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(limit.current / limit.max) * 100}%` }}
                                    className={cn("h-full rounded-full", limit.color)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* SUB TAB 3: VISUAL BRANDING & CUSTOM DOMAINS */}
                      {tenantSubTab === "marca" && (
                        <motion.div
                          key="marca"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          {/* Accent Color picker */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Cor de Destaque da Filial</h4>
                              <p className="text-[10px] text-muted-foreground font-semibold">Altere as cores principais dos botões e painéis para a identidade dessa filial</p>
                            </div>
                            <div className="flex gap-2">
                              {[
                                { id: "indigo" as const, name: "Stripe Indigo", color: "bg-indigo-600" },
                                { id: "red" as const, name: "iFood Red", color: "bg-red-600" },
                                { id: "emerald" as const, name: "Emerald", color: "bg-emerald-600" },
                                { id: "amber" as const, name: "Amber", color: "bg-amber-600" },
                              ].map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => setBrandColor(c.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-extrabold border-2 transition-all active:scale-95 shadow-sm",
                                    brandColor === c.id 
                                      ? "border-slate-800 dark:border-white font-bold" 
                                      : "border-transparent bg-slate-100 dark:bg-muted text-muted-foreground"
                                  )}
                                >
                                  <span className={cn("h-3 w-3 rounded-full shrink-0", c.color)} />
                                  <span>{c.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom subdomains */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Subdomínio & Link de Acesso</h4>
                              <p className="text-[10px] text-muted-foreground font-semibold">Endereço exclusivo para acessar o painel dessa filial</p>
                            </div>

                            <div className="flex gap-2.5 max-w-md">
                              <div className="flex items-center gap-1 border rounded-xl bg-white dark:bg-card px-3 py-2.5 w-full shadow-inner">
                                <span className="text-xs font-bold text-muted-foreground shrink-0 select-none">https://</span>
                                <input
                                  type="text"
                                  placeholder="saborearte"
                                  value={subdomain}
                                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                  className="bg-transparent outline-none text-xs font-extrabold text-slate-800 dark:text-slate-100 w-full placeholder-slate-400"
                                />
                                <span className="text-xs font-bold text-muted-foreground shrink-0 select-none">.sistema.com</span>
                              </div>

                              <Button
                                type="button"
                                onClick={handleVerifyDns}
                                disabled={dnsStatus === "verifying" || !subdomain}
                                className="rounded-xl h-11 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shrink-0 shadow-sm border-0"
                              >
                                {dnsStatus === "verifying" ? "Verificando..." : "Verificar DNS"}
                              </Button>
                            </div>

                            {/* Propagation state */}
                            {dnsStatus === "propagated" && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 max-w-md"
                              >
                                <Wifi className="h-4 w-4 animate-bounce" />
                                <span>DNS Propagado com sucesso! Link ativo e seguro.</span>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 2. PRODUCT CATALOG MANAGER */}
            {activeTab === "catalog" && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-3">
                  
                  {/* Category Management card */}
                  <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden h-max">
                    <CardHeader className="border-b p-5 bg-slate-50/50 dark:bg-muted/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-black flex items-center gap-1.5">
                          <FolderPlus className="h-4 w-4 text-indigo-500" />
                          Categorias
                        </CardTitle>
                        <Button 
                          onClick={openCategoryAdd} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-500/10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="text-[9px] font-semibold uppercase">Divisão do cardápio</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      {categories.map(cat => (
                        <div 
                          key={cat.id} 
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-2xl border transition-colors",
                            catalogCategoryFilter === cat.id ? "border-indigo-500 bg-indigo-500/5" : "border-slate-100 dark:border-muted/30"
                          )}
                        >
                          <button 
                            onClick={() => setCatalogCategoryFilter(catalogCategoryFilter === cat.id ? "all" : cat.id)}
                            className="flex items-center gap-2.5 flex-1 text-left"
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{cat.name}</span>
                          </button>
                          
                          <div className="flex items-center gap-0.5">
                            <Button 
                              onClick={() => openCategoryEdit(cat)} 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-slate-400 hover:text-slate-800 rounded-lg"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              onClick={() => deleteCategory(cat.id)} 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-slate-400 hover:text-red-500 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Products list manager */}
                  <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden md:col-span-2">
                    <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-sm font-black flex items-center gap-1.5">
                            <UtensilsCrossed className="h-4.5 w-4.5 text-indigo-500" />
                            Fichas de Produtos ({products.length})
                          </CardTitle>
                          <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Itens vendidos no PDV e delivery</CardDescription>
                        </div>
                        <Button 
                          onClick={openProductAdd}
                          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 px-4 shadow-sm border-0"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5 stroke-[3]" />
                          Novo Produto
                        </Button>
                      </div>
                      
                      {/* Search and Quick Filters */}
                      <div className="flex gap-2.5 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            placeholder="Buscar produto pelo nome..."
                            value={catalogSearch}
                            onChange={e => setCatalogSearch(e.target.value)}
                            className="pl-8 h-9 text-xs rounded-xl"
                          />
                        </div>
                        {catalogCategoryFilter !== "all" && (
                          <Badge 
                            onClick={() => setCatalogCategoryFilter("all")} 
                            className="bg-indigo-600/10 text-indigo-600 border border-indigo-600/20 hover:bg-indigo-600/15 text-[10px] font-bold rounded-xl flex items-center gap-1 px-3 cursor-pointer"
                          >
                            Filtrado • Limpar X
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 max-h-[500px] overflow-y-auto space-y-2">
                      {filteredProducts.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-xs font-semibold">
                          <Info className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          Nenhum produto cadastrado nesta categoria.
                        </div>
                      ) : (
                        filteredProducts.map(p => {
                          const cat = categories.find(c => c.id === p.categoryId)
                          return (
                            <div 
                              key={p.id} 
                              className="flex items-center justify-between p-3 border border-slate-100 dark:border-muted/20 bg-slate-50/20 dark:bg-card/10 hover:border-slate-300 rounded-2xl transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 dark:bg-muted rounded-xl flex items-center justify-center text-lg shadow-inner">
                                  {cat?.icon || "🍔"}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-none">{p.name}</h4>
                                    {!p.available && (
                                      <Badge variant="outline" className="text-[8px] font-bold uppercase text-red-500 border-red-500/20 bg-red-500/5 px-1 h-4">Pausado</Badge>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-medium mt-1 truncate max-w-[200px] md:max-w-sm">{p.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-black text-xs text-slate-800 dark:text-slate-100 shrink-0">
                                  R$ {p.price.toFixed(2).replace(".", ",")}
                                </span>

                                <div className="flex items-center gap-0.5">
                                  <Button 
                                    onClick={() => openProductEdit(p)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-slate-800 rounded-lg"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    onClick={() => deleteProduct(p.id)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* 3. INVENTORY & ADDONS */}
            {activeTab === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-3">
                  
                  {/* Custom Addons management (Burger extra ingredients) */}
                  <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden h-max">
                    <CardHeader className="border-b p-5 bg-slate-50/50 dark:bg-muted/10">
                      <CardTitle className="text-sm font-black flex items-center gap-1.5">
                        <PlusCircle className="h-4.5 w-4.5 text-indigo-500" />
                        Opcionais / Adicionais
                      </CardTitle>
                      <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Cobrados à parte no PDV</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 space-y-4">
                      {/* Add new addon quick form */}
                      <form onSubmit={handleAddonAdd} className="flex gap-2">
                        <Input 
                          placeholder="Ex: Cheddar"
                          value={addonName}
                          onChange={e => setAddonName(e.target.value)}
                          className="h-9 text-xs rounded-xl flex-1"
                        />
                        <Input 
                          placeholder="R$ 3,00"
                          value={addonPrice}
                          onChange={e => setAddonPrice(e.target.value)}
                          className="h-9 text-xs rounded-xl w-16 text-center"
                        />
                        <Button type="submit" size="icon" className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow border-0 shrink-0">
                          <Plus className="h-4 w-4 stroke-[3]" />
                        </Button>
                      </form>

                      {/* Addons list */}
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                        {addons.map(addon => (
                          <div 
                            key={addon.id}
                            className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-muted/30 bg-slate-50/30 text-xs font-semibold"
                          >
                            <span className="text-slate-800 dark:text-slate-200 truncate">{addon.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100">
                                R$ {addon.price.toFixed(2).replace(".", ",")}
                              </span>
                              <Button 
                                onClick={() => deleteAddon(addon.id)} 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-slate-400 hover:text-red-500 rounded-lg"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stock Ingredients inventory sheet */}
                  <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden md:col-span-2">
                    <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-sm font-black flex items-center gap-1.5">
                            <Package className="h-4.5 w-4.5 text-indigo-500" />
                            Ingredientes & Fichas Técnicas
                          </CardTitle>
                          <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Acompanhamento de estoque em tempo real</CardDescription>
                        </div>
                        <Button 
                          onClick={openIngredientAdd}
                          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 px-4 border-0 shadow-sm"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5 stroke-[3]" />
                          Cadastrar Item
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 max-h-[500px] overflow-y-auto space-y-2">
                      {inventory.map(ing => {
                        const isCritical = ing.quantity <= ing.minQuantity
                        return (
                          <div 
                            key={ing.id}
                            className={cn(
                              "flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 border rounded-2xl transition-all bg-slate-50/20 dark:bg-card/10",
                              isCritical ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50" : "border-slate-100 dark:border-muted/20 hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={cn(
                                "p-2 rounded-xl shrink-0 shadow-inner",
                                isCritical ? "bg-amber-500/10 text-amber-500 animate-pulse" : "bg-indigo-600/10 text-indigo-600"
                              )}>
                                <Package className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-none">{ing.name}</h4>
                                  {isCritical && (
                                    <Badge className="bg-amber-500 text-white font-black text-[8px] uppercase px-1.5 h-4 flex items-center gap-0.5 border-none shadow-sm">
                                      <BadgeAlert className="h-2.5 w-2.5" /> Estoque Crítico
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground font-semibold mt-1">Fornecedor: {ing.supplier}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5 justify-between md:justify-end border-t md:border-t-0 pt-2.5 md:pt-0">
                              <div className="text-left md:text-right text-xs">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Qtd Atual</span>
                                <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                                  {ing.quantity} {ing.unit} 
                                  <span className="text-[10px] font-medium text-muted-foreground ml-1">/ min: {ing.minQuantity}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-0.5">
                                <Button 
                                  onClick={() => openIngredientEdit(ing)}
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-slate-800 rounded-lg"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  onClick={() => deleteIngredient(ing.id)}
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* 4. OPERATIONAL SYSTEM PARAMS (PDV, KDS, DELIVERY) */}
            {activeTab === "system-params" && (
              <motion.div
                key="system-params"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-3"
              >
                {/* POS / PDV parameters */}
                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                  <CardHeader className="border-b p-5 bg-slate-50/50 dark:bg-muted/10">
                    <CardTitle className="text-sm font-black flex items-center gap-1.5">
                      <Settings className="h-4.5 w-4.5 text-indigo-500" />
                      Regras do PDV (Frente)
                    </CardTitle>
                    <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Cobrança e Frente de Caixa</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-5 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Taxa de Serviço (%)</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          value={pdvSettings.serviceFee}
                          onChange={e => updatePdvSettings({ serviceFee: parseFloat(e.target.value) || 0 })}
                          className="h-10 text-xs rounded-xl"
                        />
                        <span className="text-xs text-muted-foreground font-bold">%</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Alíquota de Tributo Fiscal (%)</Label>
                      <Input 
                        type="number"
                        value={pdvSettings.taxRate}
                        onChange={e => updatePdvSettings({ taxRate: parseFloat(e.target.value) || 0 })}
                        className="h-10 text-xs rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Impressora de Cupons</Label>
                      <select 
                        value={pdvSettings.receiptPrinter}
                        onChange={e => updatePdvSettings({ receiptPrinter: e.target.value })}
                        className="w-full h-10 border rounded-xl bg-white dark:bg-card px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                      >
                        <option value="Caixa Térmica 80mm">Caixa Térmica 80mm</option>
                        <option value="Cozinha Impressora 58mm">Cozinha Impressora 58mm</option>
                        <option value="Balcão Térmica">Balcão Térmica</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <span className="text-xs text-slate-800 dark:text-slate-200">Atalhos de Teclado Rápidos</span>
                        <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Habilita F2 (Pagar), / (Buscar)</p>
                      </div>
                      <Switch 
                        checked={pdvSettings.enableShortcuts}
                        onCheckedChange={checked => updatePdvSettings({ enableShortcuts: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Kitchen / KDS parameters */}
                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                  <CardHeader className="border-b p-5 bg-slate-50/50 dark:bg-muted/10">
                    <CardTitle className="text-sm font-black flex items-center gap-1.5">
                      <Sliders className="h-4.5 w-4.5 text-indigo-500" />
                      Painel de Cozinha (KDS)
                    </CardTitle>
                    <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Gestão e Tempos de Preparo</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-5 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Aviso de Atraso Crítico</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          value={kdsSettings.alertDelayMinutes}
                          onChange={e => updateKdsSettings({ alertDelayMinutes: parseInt(e.target.value) || 0 })}
                          className="h-10 text-xs rounded-xl"
                        />
                        <span className="text-xs text-muted-foreground font-bold">min</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground leading-normal mt-0.5">Alerta visual pisca no painel se o pedido ultrapassar este tempo</p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <span className="text-xs text-slate-800 dark:text-slate-200">Alerta Sonoro de Novo Chamado</span>
                        <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Emite um sino sonoro a cada novo pedido</p>
                      </div>
                      <Switch 
                        checked={kdsSettings.alertSound}
                        onCheckedChange={checked => updateKdsSettings({ alertSound: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <span className="text-xs text-slate-800 dark:text-slate-200">Priorizar Mais Antigos</span>
                        <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Ordena a esteira KDS por ordem de entrada</p>
                      </div>
                      <Switch 
                        checked={kdsSettings.oldestFirst}
                        onCheckedChange={checked => updateKdsSettings({ oldestFirst: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery / Integrations parameters */}
                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                  <CardHeader className="border-b p-5 bg-slate-50/50 dark:bg-muted/10">
                    <CardTitle className="text-sm font-black flex items-center gap-1.5">
                      <Sliders className="h-4.5 w-4.5 text-indigo-500" />
                      Parâmetros de Delivery
                    </CardTitle>
                    <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Regras de Entrega e Envio</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-5 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Taxa de Entrega Padrão</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-bold">R$</span>
                        <Input 
                          type="number"
                          value={deliverySettings.flatDeliveryFee}
                          onChange={e => updateDeliverySettings({ flatDeliveryFee: parseFloat(e.target.value) || 0 })}
                          className="h-10 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Valor Mínimo do Pedido</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-bold">R$</span>
                        <Input 
                          type="number"
                          value={deliverySettings.minOrderAmount}
                          onChange={e => updateDeliverySettings({ minOrderAmount: parseFloat(e.target.value) || 0 })}
                          className="h-10 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500">Tempo Médio de Rota</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          value={deliverySettings.averageDeliveryMinutes}
                          onChange={e => updateDeliverySettings({ averageDeliveryMinutes: parseInt(e.target.value) || 0 })}
                          className="h-10 text-xs rounded-xl"
                        />
                        <span className="text-xs text-muted-foreground font-bold">min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <span className="text-xs text-slate-800 dark:text-slate-200">Aceite Automático de APIs</span>
                        <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Aprova pedidos iFood sem intervenção humana</p>
                      </div>
                      <Switch 
                        checked={deliverySettings.autoAcceptOrders}
                        onCheckedChange={checked => updateDeliverySettings({ autoAcceptOrders: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 5. SYSTEM USERS PANEL */}
            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                  <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-black tracking-tight">Colaboradores & Acesso</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Gerenciar acessos da filial ativa</CardDescription>
                      </div>
                      <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 px-4 border-0 shadow-md shadow-indigo-500/15">
                        <Plus className="mr-1.5 h-4 w-4 stroke-[3]" />
                        Novo Usuário
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {mockUsers.map((user) => {
                        const role = roleConfig[user.role] || { label: "Garçom", color: "text-slate-500 bg-slate-500/10" }
                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between rounded-3xl border border-slate-200/60 dark:border-muted/20 p-4 bg-slate-50/20 dark:bg-card/10 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">
                                  {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-[9px] font-extrabold uppercase border px-2 py-0.5 rounded-lg", role.color)}>
                                {role.label}
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800 rounded-lg">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 6. SAAS BILLING & PLANS COMPARISON */}
            {activeTab === "plans" && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                  <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                    <CardTitle className="text-base font-black tracking-tight">SaaS Planos & Faturamento</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Acompanhar faturas, assinaturas e upgrades</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    
                    {/* SaaS Plan Tiers Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { title: "Chef Básico", price: "99", active: false, color: "border-slate-200 dark:border-muted", features: ["2 usuários", "PDV Básico", "Mesa simples"] },
                        { title: "Chef Profissional", price: "199", active: false, color: "border-slate-200 dark:border-muted", features: ["5 usuários", "PDV avançado", "Cozinha KDS", "Estoque completo"] },
                        { title: "Gourmet Enterprise", price: "399", active: true, color: "border-indigo-500 shadow-md shadow-indigo-500/10", features: ["Usuários ilimitados", "KDS + Multi-telas", "Multiempresa & Filiais", "Personalização & DNS"] },
                      ].map((p, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-5 rounded-3xl border flex flex-col justify-between h-[260px] relative bg-slate-50/50 dark:bg-card/25",
                            p.active && "border-2"
                          )}
                        >
                          {p.active && (
                            <Badge className="absolute top-3.5 right-3.5 bg-indigo-600 text-white font-black text-[9px] uppercase border-none">
                              Assinatura Ativa
                            </Badge>
                          )}
                          <div className="space-y-2">
                            <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">{p.title}</span>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
                              R$ {p.price}
                              <span className="text-xs font-normal text-muted-foreground">/mês</span>
                            </h3>
                            <ul className="space-y-1.5 pt-2 text-[10px] text-muted-foreground font-semibold">
                              {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0 stroke-[3.5]" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {!p.active ? (
                            <Button className="w-full rounded-2xl h-10 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-sm border-0 mt-3 active:scale-95 transition-transform">
                              Mudar de Plano
                            </Button>
                          ) : (
                            <div className="h-10 w-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-extrabold text-xs border border-indigo-500/10">
                              Plano Vigente
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Billing Invoice history */}
                    <div className="space-y-3.5">
                      <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Histórico de Faturas SaaS</h4>
                      <div className="border border-slate-200/50 dark:border-muted/30 rounded-[26px] overflow-hidden shadow-sm bg-white dark:bg-card">
                        <div className="p-4 border-b bg-slate-50/50 dark:bg-muted/10 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Descrição / Referência</span>
                          <div className="flex gap-16 pr-8">
                            <span>Vencimento</span>
                            <span>Valor</span>
                            <span>Status</span>
                          </div>
                        </div>
                        <div className="divide-y text-xs font-semibold">
                          {[
                            { desc: "Assinatura Mensal Gourmet Enterprise - Maio/2026", date: "15/05/2026", val: "R$ 399,00", paid: true },
                            { desc: "Assinatura Mensal Gourmet Enterprise - Abril/2026", date: "15/04/2026", val: "R$ 399,00", paid: true },
                            { desc: "Assinatura Mensal Gourmet Enterprise - Março/2026", date: "15/03/2026", val: "R$ 399,00", paid: true },
                          ].map((inv, i) => (
                            <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50/30 dark:hover:bg-muted/10 transition-colors">
                              <span className="text-slate-800 dark:text-slate-100 leading-tight">{inv.desc}</span>
                              <div className="flex items-center gap-10 md:gap-14 pr-4">
                                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{inv.date}</span>
                                <span className="font-extrabold text-slate-800 dark:text-slate-100">{inv.val}</span>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/15 text-[9px] font-extrabold uppercase rounded-lg">Pago</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 7. INTEGRATIONS & APIs */}
            {activeTab === "integrations" && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {!isIFoodConfiguring && !isWhatsAppConfiguring ? (
                  <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                    <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                      <CardTitle className="text-base font-black tracking-tight">Canais de Vendas & APIs Ativas</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Integrações nativas de plataformas delivery e adquirência</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {integrationsList.map(int => {
                        const isConnected = int.id === "1" ? ifood.isConnected : int.id === "4" ? (wpp.status === "connected") : int.status === "connected"
                        return (
                          <div 
                            key={int.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-muted/20 hover:border-indigo-500/20 bg-slate-50/20 dark:bg-card/10 rounded-2xl transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl shrink-0 p-1.5 bg-slate-100 dark:bg-muted rounded-xl shadow-inner">{int.icon}</span>
                              <div className="min-w-0">
                                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{int.name}</h4>
                                <p className="text-[10px] text-muted-foreground font-medium leading-normal mt-0.5">{int.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                              {isConnected ? (
                                <>
                                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 text-[9px] font-extrabold uppercase rounded-lg h-6">Ativo</Badge>
                                  <Button 
                                    onClick={() => int.id === "1" ? setIsIFoodConfiguring(true) : int.id === "4" ? setIsWhatsAppConfiguring(true) : null}
                                    variant="outline" 
                                    className="rounded-xl h-8 text-[10px] font-black border-slate-200 hover:bg-slate-100"
                                  >
                                    Configurar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Badge className="bg-slate-200 dark:bg-muted text-muted-foreground border border-transparent text-[9px] font-extrabold uppercase rounded-lg h-6">Inativo</Badge>
                                  <Button 
                                    onClick={() => int.id === "1" ? setIsIFoodConfiguring(true) : int.id === "4" ? setIsWhatsAppConfiguring(true) : null}
                                    className="rounded-xl h-8 text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm"
                                  >
                                    Conectar
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                ) : isWhatsAppConfiguring ? (
                  // WHATSAPP PAIRING & LIVE CHAT CONSOLE
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Button 
                        onClick={() => setIsWhatsAppConfiguring(false)}
                        variant="ghost" 
                        className="rounded-2xl text-xs font-bold gap-1.5"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Integrações
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 text-[9px] font-bold uppercase rounded-lg h-6">Baileys API Gateway v3.1</Badge>
                        <Badge className={cn(
                          "text-[9px] font-extrabold uppercase border rounded-lg h-6 px-2 py-0.5",
                          wpp.status === "connected" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          wpp.status === "scanning" && "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
                          wpp.status === "generating" && "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 animate-bounce",
                          wpp.status === "disconnected" && "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          {wpp.status === "connected" && "Conectado"}
                          {wpp.status === "scanning" && "Aguardando Leitura"}
                          {wpp.status === "generating" && "Inicializando Motor..."}
                          {wpp.status === "disconnected" && "Desconectado"}
                        </Badge>
                      </div>
                    </div>

                    {/* Main UI depending on connection state */}
                    {wpp.status !== "connected" ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Connection instructions card */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                          <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                            <CardTitle className="text-sm font-black flex items-center gap-1.5">
                              <Smartphone className="h-4.5 w-4.5 text-indigo-500" />
                              Como Conectar o WhatsApp
                            </CardTitle>
                            <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Apenas 3 passos simples</CardDescription>
                          </CardHeader>
                          <CardContent className="p-6 space-y-4 font-semibold text-xs text-muted-foreground leading-relaxed">
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                                <p>Clique no botão <strong>"Gerar QR Code de Conexão"</strong> para inicializar nosso motor virtual Baileys/Evolution API isolado.</p>
                              </div>
                              <div className="flex gap-3">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                                <p>Abra o WhatsApp em seu smartphone, vá em <strong>Aparelhos Conectados &gt; Conectar um Aparelho</strong>.</p>
                              </div>
                              <div className="flex gap-3">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                                <p>Aponte a câmera do seu celular para o QR Code gerado à direita para parear a instância e habilitar o atendimento inteligente.</p>
                              </div>
                            </div>

                            <div className="pt-4">
                              {wpp.status === "disconnected" ? (
                                <Button 
                                  onClick={wpp.startConnectionFlow}
                                  className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow active:scale-95 transition-transform"
                                >
                                  Gerar QR Code de Conexão
                                </Button>
                              ) : (
                                <Button 
                                  disabled
                                  className="w-full h-11 rounded-xl text-xs font-black bg-slate-100 dark:bg-muted text-muted-foreground border-0 shadow"
                                >
                                  {wpp.status === "generating" ? "Alocando Container Virtual..." : "QR Code Pronto para Leitura"}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* QR Code Container Card */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden flex flex-col justify-between">
                          <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                            <CardTitle className="text-sm font-black flex items-center gap-1.5">
                              <MessageCircle className="h-4.5 w-4.5 text-indigo-500" />
                              Visualizador de Autenticação QR
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
                            {wpp.status === "disconnected" && (
                              <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center text-slate-400">
                                  <Smartphone className="h-8 w-8" />
                                </div>
                                <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">Sem pareamento ativo</h4>
                                <p className="text-[10px] text-muted-foreground max-w-xs font-medium">Inicie o fluxo de conexão ao lado para gerar seu token de autenticação temporário.</p>
                              </div>
                            )}

                            {wpp.status === "generating" && (
                              <div className="text-center space-y-3">
                                <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
                                <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">Construindo Instância Docker...</h4>
                                <p className="text-[10px] text-muted-foreground max-w-xs font-medium">Preparando banco de dados SQLite interno e carregando cabeçalhos de sessões.</p>
                              </div>
                            )}

                            {wpp.status === "scanning" && wpp.qrCodeVal && (
                              <div className="text-center space-y-4 w-full">
                                {/* Simulated Elegant CSS QR Code Box */}
                                <div className="relative mx-auto w-48 h-48 border-2 border-indigo-500/25 rounded-2xl p-3 bg-white shadow-inner flex items-center justify-center overflow-hidden">
                                  {/* Scanning Line Animation */}
                                  <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-bounce opacity-70" style={{ animationDuration: '3s' }} />
                                  
                                  {/* Pseudo QR code grids/shapes */}
                                  <div className="grid grid-cols-6 gap-2 w-full h-full opacity-90 p-1">
                                    <div className="border-[6px] border-slate-900 rounded-lg w-full h-full"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="border-[6px] border-slate-900 rounded-lg w-full h-full"></div>
                                    
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-300 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-300 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-300 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-300 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-300 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    
                                    <div className="border-[6px] border-slate-900 rounded-lg w-full h-full"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="bg-slate-900 rounded-md"></div>
                                    <div className="border-[6px] border-slate-900 rounded-lg w-full h-full"></div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">Aponte seu WhatsApp para a Tela</h4>
                                  <p className="text-[9px] text-indigo-600 font-extrabold">O QR code expira em: {wpp.qrCountdown} segundos</p>
                                </div>

                                <div className="pt-2 max-w-xs mx-auto">
                                  <Button 
                                    onClick={wpp.simulateScan}
                                    className="w-full h-10 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Simular Escaneamento (Celular)
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      // DUAL COLUMN LIVE CHAT BOARD AND Broadcaster Notifications Panel
                      <div className="grid gap-6 md:grid-cols-4">
                        {/* 1. Chats list - Col 1 */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden md:col-span-1">
                          <CardHeader className="border-b p-4 bg-slate-50/50 dark:bg-muted/10">
                            <CardTitle className="text-xs font-black flex items-center justify-between uppercase tracking-widest text-slate-500">
                              Conversas Ativas
                              <Badge className="bg-indigo-600 text-white font-extrabold text-[8px] border-none px-1.5 py-0 h-4">
                                {wpp.chats.length}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-2 space-y-1.5 max-h-[460px] overflow-y-auto">
                            {wpp.chats.map(chat => {
                              const isActive = chat.id === wpp.activeChatId
                              return (
                                <button
                                  key={chat.id}
                                  onClick={() => wpp.setActiveChatId(chat.id)}
                                  className={cn(
                                    "w-full text-left p-3 rounded-2xl transition-all border flex items-start gap-2.5",
                                    isActive 
                                      ? "bg-indigo-600/5 border-indigo-600/35" 
                                      : "border-transparent hover:bg-slate-50 dark:hover:bg-muted/10 bg-transparent"
                                  )}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center shrink-0 font-extrabold text-xs text-indigo-600 relative">
                                    {chat.clientName[0]}
                                    {chat.unread && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white dark:border-card" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate">{chat.clientName}</span>
                                      <span className="text-[8px] text-muted-foreground font-semibold shrink-0">{chat.timestamp}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-semibold truncate mt-0.5">{chat.lastMessage}</p>
                                    
                                    {chat.isAiActive && (
                                      <div className="mt-1 flex items-center gap-1">
                                        <Bot className="h-3 w-3 text-violet-500" />
                                        <span className="text-[7.5px] font-black uppercase text-violet-500">IA Copilot On</span>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </CardContent>
                        </Card>

                        {/* 2. Active Chat Stream & Messaging Box - Col 2 & 3 */}
                        <div className="md:col-span-2 space-y-6">
                          {(() => {
                            const chat = wpp.chats.find(c => c.id === wpp.activeChatId)
                            if (!chat) {
                              return (
                                <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card h-[480px] flex items-center justify-center">
                                  <div className="text-center space-y-2">
                                    <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
                                    <p className="text-xs text-muted-foreground font-semibold">Selecione uma conversa para iniciar o atendimento híbrido.</p>
                                  </div>
                                </Card>
                              )
                            }

                            return (
                              <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden h-[480px] flex flex-col justify-between">
                                {/* Chat Header */}
                                <div className="border-b p-4 bg-slate-50/50 dark:bg-muted/10 flex items-center justify-between shrink-0">
                                  <div className="min-w-0">
                                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                      {chat.clientName}
                                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                    </h4>
                                    <p className="text-[9px] text-muted-foreground font-mono">{chat.phone}</p>
                                  </div>

                                  {/* AI Copilot Toggle */}
                                  <div className="flex items-center gap-2 border bg-white dark:bg-muted/20 px-3 py-1.5 rounded-2xl shadow-sm">
                                    <div className="text-right">
                                      <span className="text-[8px] font-black uppercase text-slate-500 block leading-none">AI Copilot</span>
                                      <span className="text-[7.5px] text-muted-foreground font-medium">{chat.isAiActive ? "Autopilot On" : "Manual"}</span>
                                    </div>
                                    <Switch 
                                      checked={chat.isAiActive}
                                      onCheckedChange={() => wpp.toggleAiChatbot(chat.id)}
                                      className="data-[state=checked]:bg-violet-600 scale-90"
                                    />
                                  </div>
                                </div>

                                {/* Messages TIMELINE */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/10 dark:bg-card/5">
                                  {chat.messages.map((msg, i) => {
                                    const isClient = msg.sender === "client"
                                    const isAi = msg.sender === "ai"
                                    const isSystem = msg.sender === "system"
                                    
                                    if (isSystem) {
                                      return (
                                        <div key={i} className="flex justify-center my-2">
                                          <div className="bg-slate-900 border border-slate-800 text-slate-100 font-mono text-[9px] px-3 py-1.5 rounded-xl text-center max-w-sm flex items-center gap-1.5 shadow">
                                            <Terminal className="h-3 w-3 text-amber-500 shrink-0" />
                                            <span>{msg.text}</span>
                                            <span className="text-slate-500 ml-1">({msg.timestamp})</span>
                                          </div>
                                        </div>
                                      )
                                    }

                                    return (
                                      <div 
                                        key={i} 
                                        className={cn(
                                          "flex flex-col max-w-[80%]",
                                          isClient ? "mr-auto items-start" : "ml-auto items-end"
                                        )}
                                      >
                                        <div 
                                          className={cn(
                                            "p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm",
                                            isClient 
                                              ? "bg-white dark:bg-muted text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-transparent" 
                                              : isAi
                                              ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-none"
                                              : "bg-indigo-600 text-white rounded-tr-none"
                                          )}
                                        >
                                          {msg.text}

                                          {/* Message Rich Attachment (e.g. catalog pushed item) */}
                                          {msg.attachment && (
                                            <div className="mt-2.5 p-2 bg-black/10 dark:bg-white/10 rounded-xl border border-white/10 flex items-center justify-between gap-4">
                                              <div>
                                                <span className="text-[7.5px] font-black uppercase tracking-wider block opacity-75">Recomendação Comercial</span>
                                                <span className="text-[10px] font-black block mt-0.5">{msg.attachment.name}</span>
                                              </div>
                                              <span className="text-[10px] font-extrabold shrink-0 bg-white/15 px-2 py-0.5 rounded-lg">R$ {msg.attachment.price.toFixed(2)}</span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-1 px-1.5">
                                          {isAi && <Bot className="h-3 w-3 text-violet-500" />}
                                          <span className="text-[7.5px] text-muted-foreground font-semibold">{isAi ? "GastroSaaS AI Bot" : isClient ? "Cliente" : "Atendente"} • {msg.timestamp}</span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>

                                {/* Custom Text Input & Catalog Broadcaster Tools */}
                                <div className="border-t p-3 bg-slate-50/50 dark:bg-muted/10 space-y-2 shrink-0">
                                  {/* Quick options */}
                                  <div className="flex gap-1.5">
                                    <Button 
                                      onClick={() => wpp.sendMessage(chat.id, "Aqui está nosso Cardápio Gourmet de Hoje! Temos pratos executivos e sobremesas prontas.", { name: "Cardápio Principal GastroSaaS", price: 0, type: "menu" })}
                                      variant="outline" 
                                      className="rounded-xl h-7 px-2.5 text-[8.5px] font-black gap-1 border-slate-200"
                                    >
                                      🍔 Enviar Cardápio
                                    </Button>
                                    <Button 
                                      onClick={() => wpp.sendMessage(chat.id, "Recomendo muito nossa Feijoada Completa Premium hoje! É o nosso prato principal campeão de vendas.", { name: "Feijoada Completa Premium", price: 49.90, type: "product" })}
                                      variant="outline" 
                                      className="rounded-xl h-7 px-2.5 text-[8.5px] font-black gap-1 border-slate-200"
                                    >
                                      🚀 Indicar Feijoada (Upsell)
                                    </Button>
                                    <Button 
                                      onClick={() => wpp.sendMessage(chat.id, "Experimente nosso delicioso Pudim de Leite condensado artesanal por apenas R$ 12,90!", { name: "Pudim Artesanal", price: 12.90, type: "product" })}
                                      variant="outline" 
                                      className="rounded-xl h-7 px-2.5 text-[8.5px] font-black gap-1 border-slate-200"
                                    >
                                      🍰 Indicar Sobremesa
                                    </Button>
                                  </div>

                                  {/* Interactive message bar */}
                                  <form 
                                    onSubmit={(e) => {
                                      e.preventDefault()
                                      const form = e.currentTarget
                                      const input = form.elements.namedItem("messageText") as HTMLInputElement
                                      if (input.value.trim()) {
                                        wpp.sendMessage(chat.id, input.value.trim())
                                        input.value = ""
                                      }
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <Input 
                                      name="messageText"
                                      placeholder="Digite sua resposta ou dê orientações ao Copilot..."
                                      className="h-10 text-xs rounded-xl flex-1 bg-white dark:bg-card border-slate-200"
                                    />
                                    <Button 
                                      type="submit" 
                                      className="h-10 w-10 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white p-0 flex items-center justify-center border-0 active:scale-95 transition-transform"
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </form>
                                </div>
                              </Card>
                            )
                          })()}
                        </div>

                        {/* 3. Automatic Broadcast timeline log - Col 4 */}
                        <div className="md:col-span-1 space-y-6">
                          {/* Automated status trigger notifications hub */}
                          <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-slate-950 text-slate-100 overflow-hidden flex flex-col h-[480px]">
                            <CardHeader className="border-b border-slate-800 p-4 bg-slate-900/50 flex-none">
                              <CardTitle className="text-[10px] font-bold font-mono flex items-center gap-1.5 text-slate-400 uppercase tracking-widest">
                                <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                                KDS Broadcast Webhooks
                              </CardTitle>
                              <CardDescription className="text-[8px] text-slate-500 font-semibold uppercase mt-0.5">Automated Event Pipeline</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 bg-black font-mono text-[9px] leading-relaxed overflow-y-auto flex-1 space-y-2">
                              {wpp.autoStatusMessages.length === 0 ? (
                                <div className="text-slate-600 text-center py-20 italic">
                                  Sem disparos automáticos ainda.<br />
                                  Atualize o status de um pedido no KDS para ver a automação agir.
                                </div>
                              ) : (
                                wpp.autoStatusMessages.map((msg, i) => (
                                  <div key={i} className="border-b border-slate-900 pb-2 flex gap-1.5 items-start">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-300 break-words">{msg}</span>
                                  </div>
                                ))
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // ADVANCED STRIPI-LIKE IFOOD OBSERVABILITY & SANDBOX DASHBOARD
                  <div className="space-y-6">
                    {/* Sub-Header */}
                    <div className="flex items-center justify-between">
                      <Button 
                        onClick={() => setIsIFoodConfiguring(false)}
                        variant="ghost" 
                        className="rounded-2xl text-xs font-bold gap-1.5"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Integrações
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-600/10 text-indigo-600 border border-indigo-600/20 text-[9px] font-bold uppercase rounded-lg h-6">iFood POS v2.0</Badge>
                        <Badge className={cn(
                          "text-[9px] font-extrabold uppercase border rounded-lg h-6 px-2 py-0.5",
                          ifood.isConnected 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
                        )}>
                          {ifood.isConnected ? "Conectado" : "Desconectado"}
                        </Badge>
                      </div>
                    </div>

                    {/* HUD metrics cards */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                      <Card className="rounded-2xl border-slate-200/50 dark:border-muted/20 shadow-sm bg-white dark:bg-card">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Latência da Fila</span>
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                              <HeartPulse className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
                              {ifood.latency > 0 ? `${ifood.latency}ms` : "0ms"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-slate-200/50 dark:border-muted/20 shadow-sm bg-white dark:bg-card">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Sucesso Webhooks</span>
                            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                              <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                              {ifood.successCount}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-slate-200/50 dark:border-muted/20 shadow-sm bg-white dark:bg-card">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Erros / DLQ</span>
                            <p className="text-lg font-black text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-0.5">
                              <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                              {ifood.failureCount}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-slate-200/50 dark:border-muted/20 shadow-sm bg-white dark:bg-card">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Fila de Eventos</span>
                            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mt-0.5">
                              <Database className="h-4.5 w-4.5 text-indigo-500 animate-bounce" />
                              {ifood.jobs.filter(j => j.status === "pending" || j.status === "processing").length} ativo(s)
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Main layout */}
                    <div className="grid gap-6 md:grid-cols-3">
                      
                      {/* Left col - Mappings, Queue Inspector, Sandbox */}
                      <div className="md:col-span-2 space-y-6">
                        
                        {/* Developer Webhook Playground */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                          <CardHeader className="border-b p-5 bg-amber-500/5">
                            <CardTitle className="text-sm font-black flex items-center gap-1.5 text-amber-600">
                              <Sliders className="h-4.5 w-4.5" />
                              Developer Sandbox (Simulador de Webhooks)
                            </CardTitle>
                            <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Dispare cargas realistas na fila de mensageria</CardDescription>
                          </CardHeader>
                          <CardContent className="p-5 space-y-4">
                            <div className="p-3 bg-slate-50 dark:bg-muted/30 border rounded-2xl text-[11px] font-medium leading-relaxed text-muted-foreground flex gap-2">
                              <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                              <span>
                                Ao clicar em um template abaixo, o simulador irá disparar um payload JSON de webhook do iFood (`ORDER_CREATED`) para o <strong>Webhook Gateway</strong>. O evento entrará na fila do Redis, será processado assincronamente pelo Worker, deduplicado na camada de idempotência e enviado via <strong>WebSocket Gateway</strong> para o KDS.
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              <Button 
                                onClick={() => ifood.simulateIncomingWebhook("burger")}
                                disabled={!ifood.isConnected}
                                className="rounded-xl h-10 px-4 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm"
                              >
                                <Play className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                                Webhook: Feijoada Completa
                              </Button>
                              <Button 
                                onClick={() => ifood.simulateIncomingWebhook("pizza")}
                                disabled={!ifood.isConnected}
                                className="rounded-xl h-10 px-4 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm"
                              >
                                <Play className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                                Webhook: Picanha na Chapa
                              </Button>
                              <Button 
                                onClick={() => ifood.simulateIncomingWebhook("coke")}
                                disabled={!ifood.isConnected}
                                className="rounded-xl h-10 px-4 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm"
                              >
                                <Play className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                                Webhook: Marmita P
                              </Button>
                              <Button 
                                onClick={ifood.simulateDuplicateWebhook}
                                disabled={!ifood.isConnected || ifood.jobs.length === 0}
                                variant="outline"
                                className="rounded-xl h-10 px-4 text-xs font-black border-red-500/25 text-red-500 hover:bg-red-500/10"
                              >
                                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                Forçar Envio Duplicado (Idempotência)
                              </Button>
                              <Button 
                                onClick={ifood.clearQueue}
                                variant="ghost"
                                className="rounded-xl h-10 px-3 text-xs font-bold text-slate-400 hover:text-slate-800"
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Limpar Sandbox
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* SKU Product Mapping Card */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                          <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-sm font-black flex items-center gap-1.5">
                                  <Layers className="h-4.5 w-4.5 text-indigo-500" />
                                  Mapeamento de SKU do Cardápio iFood
                                </CardTitle>
                                <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Tabela: integration_product_mapping</CardDescription>
                              </div>
                              <Button 
                                onClick={ifood.triggerMenuSync}
                                disabled={!ifood.isConnected}
                                className="rounded-xl h-9 px-4 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow"
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Sincronizar Cardápio
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-5 max-h-[300px] overflow-y-auto space-y-2">
                            {ifood.skuMappings.map(map => (
                              <div 
                                key={map.productId}
                                className="flex items-center justify-between p-3 border border-slate-100 dark:border-muted/10 bg-slate-50/20 dark:bg-card/10 rounded-2xl text-xs font-semibold"
                              >
                                <span className="text-slate-800 dark:text-slate-200 truncate max-w-sm">{map.productName}</span>
                                <div className="flex items-center gap-4 shrink-0">
                                  <Badge variant="outline" className="font-mono text-[9px] px-2 py-0.5 rounded-lg border-slate-200">{map.marketplaceSku}</Badge>
                                  {map.synced ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 text-[8px] font-extrabold uppercase px-1.5 rounded-lg">Sincronizado</Badge>
                                  ) : (
                                    <Badge className="bg-slate-200 dark:bg-muted text-muted-foreground border border-transparent text-[8px] font-extrabold uppercase px-1.5 rounded-lg">Pendente</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Webhook Queue Inspector */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                          <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                            <CardTitle className="text-sm font-black flex items-center gap-1.5">
                              <Database className="h-4.5 w-4.5 text-indigo-500" />
                              Redis Queue Inspector (Fila Ativa)
                            </CardTitle>
                            <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Monitoramento assíncrono dos Workers em tempo real</CardDescription>
                          </CardHeader>
                          <CardContent className="p-5 max-h-[320px] overflow-y-auto space-y-2">
                            {ifood.jobs.length === 0 ? (
                              <div className="py-12 text-center text-muted-foreground text-xs font-semibold">
                                <History className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                Fila de mensageria limpa. Aguardando webhooks externos...
                              </div>
                            ) : (
                              ifood.jobs.map(job => (
                                <div 
                                  key={job.id}
                                  className={cn(
                                    "p-3.5 border rounded-2xl transition-all text-xs",
                                    job.status === "completed" && "border-slate-100 dark:border-muted/10 bg-slate-50/20 dark:bg-card/10",
                                    job.status === "failed" && "border-red-500/20 bg-red-500/5",
                                    job.status === "processing" && "border-indigo-500/35 bg-indigo-500/5 animate-pulse"
                                  )}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-slate-800 dark:text-slate-100">Job ID: {job.id}</span>
                                        <Badge className={cn(
                                          "text-[8px] font-extrabold uppercase px-1.5 py-0 h-4 border-none",
                                          job.status === "completed" && "bg-emerald-500 text-white",
                                          job.status === "failed" && "bg-red-500 text-white",
                                          job.status === "processing" && "bg-indigo-600 text-white",
                                          job.status === "pending" && "bg-amber-500 text-white"
                                        )}>
                                          {job.status}
                                        </Badge>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground font-mono">Event ID: {job.eventId} • Time: {job.timestamp}</p>
                                    </div>

                                    <div className="text-left sm:text-right shrink-0">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">Latência</span>
                                      <p className="font-black text-slate-800 dark:text-slate-100 mt-0.5">
                                        {job.latencyMs > 0 ? `${job.latencyMs}ms` : "--"}
                                      </p>
                                    </div>
                                  </div>

                                  {job.errorMessage && (
                                    <div className={cn(
                                      "mt-2.5 p-2 rounded-lg font-mono text-[9px] leading-relaxed break-all",
                                      job.status === "failed" ? "bg-red-500/10 text-red-500 border border-red-500/15" : "bg-amber-500/10 text-amber-500 border border-amber-500/15"
                                    )}>
                                      Error Details: {job.errorMessage}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </CardContent>
                        </Card>

                      </div>

                      {/* Right col - OAuth Credentials & Terminal Log */}
                      <div className="space-y-6">
                        
                        {/* iFood OAuth Credentials Card */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                          <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                            <CardTitle className="text-sm font-black flex items-center gap-1.5">
                              <Lock className="h-4.5 w-4.5 text-indigo-500" />
                              OAuth Credenciais iFood
                            </CardTitle>
                            <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Conexão segura (Backend Only)</CardDescription>
                          </CardHeader>
                          <CardContent className="p-5 space-y-4">
                            
                            <div className="space-y-1.5 font-bold text-xs">
                              <Label className="text-slate-500">Merchant ID (Restaurante)</Label>
                              <Input 
                                placeholder="Ex: IF-9482"
                                value={ifood.merchantId}
                                disabled={ifood.isConnected}
                                className="h-10 text-xs rounded-xl"
                              />
                            </div>

                            <div className="space-y-1.5 font-bold text-xs">
                              <Label className="text-slate-500">Client ID (API Key)</Label>
                              <Input 
                                placeholder="Ex: key_847294827"
                                value={ifood.isConnected ? "•••••••••••••••••••••" : ifood.clientId}
                                onChange={e => ifood.connectStore(ifood.merchantId, e.target.value, ifood.clientSecret)} // Temp hook sync
                                disabled={ifood.isConnected}
                                className="h-10 text-xs rounded-xl"
                              />
                            </div>

                            <div className="space-y-1.5 font-bold text-xs">
                              <Label className="text-slate-500">Client Secret (API Token)</Label>
                              <Input 
                                type="password"
                                placeholder="Ex: sec_94827592749"
                                value={ifood.isConnected ? "•••••••••••••••••••••" : ifood.clientSecret}
                                onChange={e => ifood.connectStore(ifood.merchantId, ifood.clientId, e.target.value)} // Temp hook sync
                                disabled={ifood.isConnected}
                                className="h-10 text-xs rounded-xl"
                              />
                            </div>

                            <div className="pt-2">
                              {!ifood.isConnected ? (
                                <Button 
                                  onClick={() => ifood.connectStore(ifood.merchantId, "client-id-enterprise", "client-secret-enterprise")}
                                  className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow active:scale-95 transition-transform"
                                >
                                  Autenticar via OAuth 2.0
                                </Button>
                              ) : (
                                <Button 
                                  onClick={ifood.disconnectStore}
                                  variant="outline"
                                  className="w-full h-11 rounded-xl text-xs font-black border-red-500/25 text-red-500 hover:bg-red-500/10 active:scale-95 transition-transform"
                                >
                                  Desconectar iFood
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Terminal Logs Event Timeline */}
                        <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-slate-950 text-slate-100 overflow-hidden">
                          <CardHeader className="border-b border-slate-800 p-5 bg-slate-900/50">
                            <CardTitle className="text-xs font-bold font-mono flex items-center gap-1.5 text-slate-400 uppercase tracking-widest">
                              <Terminal className="h-4 w-4 text-emerald-500 animate-pulse" />
                              Technical Observability Logs
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 bg-black font-mono text-[9px] leading-relaxed max-h-[300px] overflow-y-auto space-y-1.5 shadow-inner">
                            {ifood.logs.map(log => (
                              <div key={log.id} className="flex items-start gap-1.5">
                                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                                <span className={cn(
                                  "break-all flex-1",
                                  log.type === "success" && "text-emerald-500 font-bold",
                                  log.type === "error" && "text-red-500 font-bold",
                                  log.type === "warning" && "text-amber-500",
                                  log.type === "info" && "text-slate-300"
                                )}>
                                  {log.message}
                                </span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* MODAL 1: ADD NEW SAAS BRANCH */}
      <Dialog open={newBranchOpen} onOpenChange={setNewBranchOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-t-[32px] sm:rounded-3xl border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[420px]">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-500" />
                Cadastrar Nova Filial
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Rede: Sabor & Arte</p>
            </div>
          </div>
          <form onSubmit={handleAddBranch} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Nome Fantasia da Loja</Label>
              <Input
                required
                placeholder="Ex: Restaurante Sabor & Arte - Filial Pinheiros"
                value={nbName}
                onChange={(e) => setNbName(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Endereço / Localização</Label>
              <Input
                required
                placeholder="Ex: São Paulo, SP - Rua dos Pinheiros, 1200"
                value={nbLocation}
                onChange={(e) => setNbLocation(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Plano SaaS Inicial</Label>
              <select
                value={nbPlan}
                onChange={(e) => setNbPlan(e.target.value)}
                className="w-full border rounded-xl bg-white dark:bg-card px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm"
              >
                <option value="Chef Básico">Chef Básico (R$ 99/mês)</option>
                <option value="Chef Profissional">Chef Profissional (R$ 199/mês)</option>
                <option value="Chef Gourmet Enterprise">Gourmet Enterprise (R$ 399/mês)</option>
              </select>
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md">
                Salvar Loja e Alocar Recursos
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ADD / EDIT PRODUCT */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-t-[32px] sm:rounded-3xl border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[440px]">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-indigo-500" />
                {editingProduct ? "Editar Ficha de Produto" : "Criar Novo Produto"}
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Configuração do Cardápio</p>
            </div>
          </div>
          <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Nome do Produto</Label>
              <Input
                required
                placeholder="Ex: Hambúrguer Gorgonzola Deluxe"
                value={prodName}
                onChange={e => setProdName(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Preço de Venda (R$)</Label>
                <Input
                  required
                  placeholder="Ex: 34,90"
                  value={prodPrice}
                  onChange={e => setProdPrice(e.target.value)}
                  className="h-11 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Categoria</Label>
                <select
                  value={prodCat}
                  onChange={e => setProdCat(e.target.value)}
                  className="w-full h-11 border rounded-xl bg-white dark:bg-card px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Descrição Comercial / Ingredientes</Label>
              <Textarea
                placeholder="Escreva a receita comercial ou itens do prato..."
                value={prodDesc}
                onChange={e => setProdDesc(e.target.value)}
                className="resize-none rounded-xl text-xs border-slate-200 dark:border-muted"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4 pb-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Disponibilidade de Venda</span>
                <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Mostra ou oculta o prato nos tablets e KDS</p>
              </div>
              <Switch 
                checked={prodAvailable}
                onCheckedChange={checked => setProdAvailable(checked)}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md">
                Salvar Produto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ADD / EDIT CATEGORY */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-t-[32px] sm:rounded-3xl border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[360px]">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-indigo-500" />
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h2>
            </div>
          </div>
          <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Nome da Categoria</Label>
              <Input
                required
                placeholder="Ex: Massas Artesanais"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Emoji representativo</Label>
                <Input
                  required
                  placeholder="Ex: 🍝"
                  value={catIcon}
                  onChange={e => setCatIcon(e.target.value)}
                  className="h-11 rounded-xl text-center text-lg"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Cor Hex</Label>
                <Input
                  type="color"
                  value={catColor}
                  onChange={e => setCatColor(e.target.value)}
                  className="h-11 rounded-xl w-full p-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md">
                Salvar Categoria
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: ADD / EDIT INGREDIENT */}
      <Dialog open={ingredientModalOpen} onOpenChange={setIngredientModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-t-[32px] sm:rounded-3xl border-none shadow-2xl bg-white dark:bg-card fixed bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[420px]">
          <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-500" />
                {editingIngredient ? "Editar Ingrediente" : "Novo Item de Estoque"}
              </h2>
            </div>
          </div>
          <form onSubmit={handleIngredientSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Nome do Insumo</Label>
              <Input
                required
                placeholder="Ex: Queijo Muçarela Barra"
                value={ingName}
                onChange={e => setIngName(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Qtd Inicial</Label>
                <Input
                  type="number"
                  required
                  placeholder="Ex: 50"
                  value={ingQty}
                  onChange={e => setIngQty(e.target.value)}
                  className="h-11 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Qtd Mínima (Crítica)</Label>
                <Input
                  type="number"
                  required
                  placeholder="Ex: 10"
                  value={ingMinQty}
                  onChange={e => setIngMinQty(e.target.value)}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Unidade de Medida</Label>
                <select
                  value={ingUnit}
                  onChange={e => setIngUnit(e.target.value)}
                  className="w-full h-11 border rounded-xl bg-white dark:bg-card px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm"
                >
                  <option value="kg">Quilo (kg)</option>
                  <option value="g">Grama (g)</option>
                  <option value="L">Litro (L)</option>
                  <option value="mL">Mililitro (mL)</option>
                  <option value="un">Unidade (un)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Preço de Custo Médio (R$)</Label>
                <Input
                  required
                  placeholder="Ex: 24,90"
                  value={ingPrice}
                  onChange={e => setIngPrice(e.target.value)}
                  className="h-11 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500">Fornecedor Preferencial</Label>
              <Input
                placeholder="Ex: Distribuidora de Alimentos S.A."
                value={ingSupplier}
                onChange={e => setIngSupplier(e.target.value)}
                className="h-11 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-md">
                Salvar Insumo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
