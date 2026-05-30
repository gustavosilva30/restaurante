"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Building2,
  Users,
  TrendingUp,
  Server,
  DollarSign,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Eye,
  PlusCircle,
  HelpCircle,
  Percent,
  Sliders,
  Database,
  Activity,
  UserCheck,
  RefreshCw,
  Search,
  Check,
  Ban
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppLayout } from "@/components/layout/app-layout"
import { cn } from "@/lib/utils"

interface Tenant {
  id: string
  name: string
  owner: string
  email: string
  domain: string
  plan: "Básico" | "Profissional" | "Enterprise"
  status: "active" | "pending" | "suspended"
  branchesCount: number
  mrr: number
  joinedAt: string
}

export default function AdminPage() {
  // Role Simulation state: 'super_admin' | 'operator'
  const [simulatedRole, setSimulatedRole] = React.useState<"super_admin" | "operator">("super_admin")
  
  // Platform settings state (System Costs)
  const [awsCost, setAwsCost] = React.useState<number>(1450)
  const [whatsAppApiCost, setWhatsAppApiCost] = React.useState<number>(680)
  const [ifoodApiCost, setIfoodApiCost] = React.useState<number>(450)
  const [supportCost, setSupportCost] = React.useState<number>(1200)

  // Plan Prices Configurator state
  const [basicPlanPrice, setBasicPlanPrice] = React.useState<number>(99)
  const [profPlanPrice, setProfPlanPrice] = React.useState<number>(199)
  const [enterprisePlanPrice, setEnterprisePlanPrice] = React.useState<number>(399)

  // Tenant search & filters
  const [searchTerm, setSearchTerm] = React.useState("")
  const [planFilter, setPlanFilter] = React.useState("all")

  // Tenants data state
  const [tenants, setTenants] = React.useState<Tenant[]>([
    { id: "t1", name: "Restaurante Sabor & Arte", owner: "João da Silva", email: "joao@saborearte.com", domain: "saborearte", plan: "Enterprise", status: "active", branchesCount: 3, mrr: 399, joinedAt: "10/01/2026" },
    { id: "t2", name: "Pizzaria Napoli", owner: "Fabio Alencar", email: "fabio@pizzarianapoli.com", domain: "pizzarianapoli", plan: "Profissional", status: "active", branchesCount: 1, mrr: 199, joinedAt: "15/02/2026" },
    { id: "t3", name: "Marmitaria Express", owner: "Maria Souza", email: "maria@marmitariaexp.com", domain: "marmitariaexpress", plan: "Básico", status: "active", branchesCount: 1, mrr: 99, joinedAt: "03/03/2026" },
    { id: "t4", name: "Sushi Prime Moema", owner: "Kenji Tanaka", email: "kenji@sushiprime.com", domain: "sushiprime", plan: "Enterprise", status: "pending", branchesCount: 2, mrr: 399, joinedAt: "22/04/2026" },
    { id: "t5", name: "Hamburgueria Brasa & Cia", owner: "Guilherme Santos", email: "gui@brasacia.com", domain: "brasacia", plan: "Profissional", status: "suspended", branchesCount: 1, mrr: 199, joinedAt: "12/12/2025" },
    { id: "t6", name: "Espaço Gourmet Buffet", owner: "Clarissa Rocha", email: "clarissa@espacogourmet.com", domain: "espacogourmet", plan: "Enterprise", status: "active", branchesCount: 1, mrr: 399, joinedAt: "19/05/2026" }
  ])

  // MRR calculations based on active and pending plans
  const totalMrr = tenants
    .filter(t => t.status !== "suspended")
    .reduce((sum, t) => {
      if (t.plan === "Básico") return sum + basicPlanPrice
      if (t.plan === "Profissional") return sum + profPlanPrice
      return sum + enterprisePlanPrice
    }, 0)

  // Cloud/System cost calculations
  const totalSystemCost = awsCost + whatsAppApiCost + ifoodApiCost + supportCost
  const profitMarginPercent = totalMrr > 0 ? ((totalMrr - totalSystemCost) / totalMrr) * 100 : 0
  const netProfit = totalMrr - totalSystemCost

  // Toggle tenant status
  const handleToggleTenantStatus = (id: string) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === "active" ? "suspended" : "active"
          return { ...t, status: nextStatus }
        }
        return t
      })
    )
  }

  // Filtered tenants list
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = planFilter === "all" || t.plan === planFilter
    return matchesSearch && matchesPlan
  })

  // Simulated metrics
  const activeTenantsCount = tenants.filter(t => t.status === "active").length

  return (
    <AppLayout title="Painel Admin">
      
      {/* 1. Header Role Simulator Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white mb-6 shadow-md">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-indigo-500 shrink-0" />
          <div>
            <h3 className="text-xs font-black tracking-tight uppercase leading-none">Simulador de Controle de Acesso</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Alterne o cargo simulado para testar as políticas de segurança da plataforma SaaS</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-0.5 bg-slate-800 rounded-xl border border-slate-700 w-max shrink-0">
          <button
            onClick={() => setSimulatedRole("super_admin")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all active:scale-95",
              simulatedRole === "super_admin" 
                ? "bg-indigo-600 text-white shadow" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Unlock className="h-3 w-3" />
            Super Admin (Liberado)
          </button>
          
          <button
            onClick={() => setSimulatedRole("operator")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all active:scale-95",
              simulatedRole === "operator" 
                ? "bg-red-600 text-white shadow" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Lock className="h-3 w-3" />
            Operador / Geral (Bloqueado)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* CASE A: USER LOCKED OUT (Simulating Operator / Regular client) */}
        {simulatedRole === "operator" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-24 text-center px-4"
          >
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10 animate-pulse">
                <Lock className="h-10 w-10 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-900 border border-slate-800 text-xs font-black flex items-center justify-center text-red-500 shadow">
                !
              </span>
            </div>

            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Acesso Restrito - Super Admin Geral</h2>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed font-semibold">
              Esta página contém informações confidenciais do ecossistema SaaS da plataforma, incluindo MRR total, controle de servidores e conciliação de faturamento.
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setSimulatedRole("super_admin")}
                className="rounded-2xl h-11 px-5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 border-0"
              >
                <Unlock className="h-4 w-4 mr-1.5" />
                Simular Perfil Super Admin
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-11 px-5 text-xs font-bold shadow-sm"
              >
                Voltar ao Início
              </Button>
            </div>
          </motion.div>
        )}

        {/* CASE B: SUPER ADMIN ACCESS GRANTED */}
        {simulatedRole === "super_admin" && (
          <motion.div
            key="granted"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 animate-in"
          >
            
            {/* KPI Cards Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* MRR Card */}
              <Card className="rounded-[28px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Faturamento MRR SaaS</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none pt-1">
                      R$ {totalMrr.toFixed(2).replace(".", ",")}
                    </h3>
                    <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" /> +12.4% este mês
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              {/* Tenants count Card */}
              <Card className="rounded-[28px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Clientes Ativos (Loja)</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none pt-1">
                      {activeTenantsCount} / {tenants.length}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                      {tenants.filter(t => t.status === "pending").length} aguardando ativação
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-sky-600/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              {/* Cloud operational cost Card */}
              <Card className="rounded-[28px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Custo de Servidores & APIs</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none pt-1">
                      R$ {totalSystemCost.toFixed(2).replace(".", ",")}
                    </h3>
                    <p className="text-[10px] text-red-500 font-extrabold">
                      Host e serviços terceirizados
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-rose-600/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Server className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              {/* Net profit/margin Card */}
              <Card className="rounded-[28px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Lucro Líquido da Plataforma</span>
                    <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none pt-1">
                      R$ {netProfit.toFixed(2).replace(".", ",")}
                    </h3>
                    <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-0.5">
                      <Percent className="h-3 w-3" /> Margem: {profitMarginPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

            </div>

            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Cost Center / Server parameters panel */}
              <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden h-max">
                <CardHeader className="border-b p-5 bg-slate-50/50 dark:bg-muted/10">
                  <CardTitle className="text-sm font-black flex items-center gap-1.5">
                    <Sliders className="h-4.5 w-4.5 text-indigo-500" />
                    Custos & Margens SaaS
                  </CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Ajuste de Custo de Host & APIs</CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500">AWS / Cloud Server Host (R$)</Label>
                    <Input 
                      type="number"
                      value={awsCost}
                      onChange={e => setAwsCost(parseFloat(e.target.value) || 0)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500">APIs WhatsApp Business (R$)</Label>
                    <Input 
                      type="number"
                      value={whatsAppApiCost}
                      onChange={e => setWhatsAppApiCost(parseFloat(e.target.value) || 0)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500">APIs iFood POS (R$)</Label>
                    <Input 
                      type="number"
                      value={ifoodApiCost}
                      onChange={e => setIfoodApiCost(parseFloat(e.target.value) || 0)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500">Suporte Técnico & Time (R$)</Label>
                    <Input 
                      type="number"
                      value={supportCost}
                      onChange={e => setSupportCost(parseFloat(e.target.value) || 0)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  {/* SaaS Plans Pricing Configurator */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400">Preço dos Planos do Sistema</h4>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold text-slate-500">Básico</Label>
                        <Input 
                          type="number"
                          value={basicPlanPrice}
                          onChange={e => setBasicPlanPrice(parseFloat(e.target.value) || 0)}
                          className="h-9 text-xs rounded-lg text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold text-slate-500">Profissional</Label>
                        <Input 
                          type="number"
                          value={profPlanPrice}
                          onChange={e => setProfPlanPrice(parseFloat(e.target.value) || 0)}
                          className="h-9 text-xs rounded-lg text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold text-slate-500">Enterprise</Label>
                        <Input 
                          type="number"
                          value={enterprisePlanPrice}
                          onChange={e => setEnterprisePlanPrice(parseFloat(e.target.value) || 0)}
                          className="h-9 text-xs rounded-lg text-center"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tenants list table */}
              <Card className="rounded-[32px] border-slate-200/60 dark:border-muted/30 shadow-md bg-white dark:bg-card overflow-hidden md:col-span-2">
                <CardHeader className="border-b p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm font-black flex items-center gap-1.5">
                        <Building2 className="h-4.5 w-4.5 text-indigo-500" />
                        Empresas Clientes / Tenants ({tenants.length})
                      </CardTitle>
                      <CardDescription className="text-[9px] font-bold uppercase tracking-wider">Gestão e controle de assinaturas dos clientes</CardDescription>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex gap-2.5 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar cliente, domínio ou proprietário..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 h-9 text-xs rounded-xl"
                      />
                    </div>

                    <select
                      value={planFilter}
                      onChange={e => setPlanFilter(e.target.value)}
                      className="h-9 border rounded-xl bg-white dark:bg-card px-3 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm"
                    >
                      <option value="all">Todos os Planos</option>
                      <option value="Básico">Plano Básico</option>
                      <option value="Profissional">Plano Profissional</option>
                      <option value="Enterprise">Plano Enterprise</option>
                    </select>
                  </div>
                </CardHeader>

                <CardContent className="p-5 max-h-[500px] overflow-y-auto space-y-2.5">
                  {filteredTenants.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground text-xs font-semibold">
                      Nenhuma empresa encontrada com os filtros selecionados.
                    </div>
                  ) : (
                    filteredTenants.map(tenant => {
                      const computedMrr = 
                        tenant.plan === "Básico" ? basicPlanPrice :
                        tenant.plan === "Profissional" ? profPlanPrice :
                        enterprisePlanPrice

                      return (
                        <div 
                          key={tenant.id}
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border rounded-2xl transition-all bg-slate-50/20 dark:bg-card/10",
                            tenant.status === "suspended" ? "border-red-500/20 bg-red-500/5" : "border-slate-100 dark:border-muted/20 hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2.5 rounded-xl shrink-0 shadow-sm",
                              tenant.status === "active" && "bg-indigo-600/10 text-indigo-600",
                              tenant.status === "pending" && "bg-amber-500/10 text-amber-500 animate-pulse",
                              tenant.status === "suspended" && "bg-red-500/10 text-red-500"
                            )}>
                              <Building2 className="h-5.5 w-5.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-none">{tenant.name}</h4>
                                <Badge className={cn(
                                  "text-[8px] font-extrabold uppercase px-1.5 py-0 h-4 border-none",
                                  tenant.status === "active" && "bg-emerald-500 text-white",
                                  tenant.status === "pending" && "bg-amber-500 text-white",
                                  tenant.status === "suspended" && "bg-red-500 text-white"
                                )}>
                                  {tenant.status === "active" && "Ativo"}
                                  {tenant.status === "pending" && "Pendente"}
                                  {tenant.status === "suspended" && "Bloqueado"}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground font-semibold mt-1">Proprietário: {tenant.owner} ({tenant.email})</p>
                              <p className="text-[10px] text-indigo-500 font-extrabold mt-0.5 uppercase tracking-wide">
                                Link: {tenant.domain}.sistema.com • Filiais: {tenant.branchesCount}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-5 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                            <div className="text-left sm:text-right text-xs">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Faturamento SaaS</span>
                              <p className="font-black text-xs text-slate-800 dark:text-slate-100 mt-0.5">R$ {computedMrr.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {tenant.status === "active" ? (
                                <Button
                                  onClick={() => handleToggleTenantStatus(tenant.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 px-3 text-[10px] font-black text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                                  title="Bloquear Loja do Cliente"
                                >
                                  <Ban className="h-3.5 w-3.5 mr-1" />
                                  Bloquear
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleToggleTenantStatus(tenant.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 px-3 text-[10px] font-black text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl"
                                  title="Reativar Loja do Cliente"
                                >
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  Ativar
                                </Button>
                              )}
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

      </AnimatePresence>
    </AppLayout>
  )
}
