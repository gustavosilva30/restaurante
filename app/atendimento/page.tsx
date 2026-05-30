"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Smartphone,
  Send,
  Bot,
  MessageCircle,
  Database,
  CheckCircle2,
  Terminal,
  Activity,
  RefreshCw,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  ShoppingCart,
  Users,
  ChevronRight,
  TrendingDown,
  Percent,
  Plus,
  Minus,
  Trash2,
  UserCheck,
  Shield,
  ActivitySquare,
  Zap,
  Star,
  Check,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AppLayout } from "@/components/layout/app-layout"
import { useWhatsApp, Chat, CartItem } from "@/hooks/use-whatsapp"

export default function AtendimentoPage() {
  const wpp = useWhatsApp()
  const [chatSearch, setChatSearch] = React.useState("")
  const [activeRightPanel, setActiveRightPanel] = React.useState<"crm" | "telemetry" | "metrics">("crm")
  
  // States to toggle right panels on/off
  const [isCartOpen, setIsCartOpen] = React.useState(true)
  const [isCrmOpen, setIsCrmOpen] = React.useState(true)

  // Filter chats by search query
  const filteredChats = wpp.chats.filter(c => 
    c.clientName.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.phone.includes(chatSearch)
  )

  const activeChat = wpp.chats.find(c => c.id === wpp.activeChatId)

  return (
    <AppLayout title="Atendimento">
      {/* 
        CONTAINER FIXO USANDO TODA A TELA 
        Subtrai a altura do Header e o padding vertical do layout para eliminar barras de rolagem globais
      */}
      <div className="flex-1 flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-8.5rem)] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-[#f8fafc] shadow-sm transition-colors duration-300">
        
        {/* UPPER BANNER / METRICS HEAD - Live Realtime Status */}
        <div className="border-b border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111827] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 gap-4 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  wpp.status === "connected" ? "bg-emerald-400" : "bg-red-400"
                )} />
                <span className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  wpp.status === "connected" ? "bg-emerald-500" : "bg-red-500"
                )} />
              </span>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Central de Atendimento WhatsApp
                <Badge className="bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 text-[9px] uppercase font-bold py-0.5 rounded-md">Enterprise</Badge>
              </h2>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-[#94a3b8] font-bold uppercase tracking-widest mt-0.5">
              Workspace de Atendimento & IA Copilot de Vendas
            </p>
          </div>

          <div className="flex items-center gap-3">
            {wpp.status === "connected" && (
              <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-slate-100 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-white/[0.06] rounded-xl text-[10px] font-bold text-slate-600 dark:text-[#94a3b8] shrink-0">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Vendas: <strong className="text-slate-800 dark:text-[#f8fafc]">R$ {wpp.metrics.totalSales.toFixed(2)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5 text-[#6366f1]" />
                  <span>Conversão: <strong className="text-slate-800 dark:text-[#f8fafc]">{wpp.metrics.aiConversionRate}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Resposta IA: <strong className="text-slate-800 dark:text-[#f8fafc]">{wpp.metrics.avgResponseTimeAi}</strong></span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge className={cn(
                "text-[9px] font-bold uppercase border rounded-lg h-7 px-3 py-1 flex items-center shadow-sm",
                wpp.status === "connected" && "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/20",
                wpp.status === "scanning" && "bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/20 animate-pulse",
                wpp.status === "generating" && "bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20",
                wpp.status === "disconnected" && "bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20"
              )}>
                {wpp.status === "connected" && "Conectado"}
                {wpp.status === "scanning" && "Aguardando Leitura"}
                {wpp.status === "generating" && "Configurando Instância..."}
                {wpp.status === "disconnected" && "Desconectado"}
              </Badge>
            </div>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex overflow-hidden">
          
          {wpp.status !== "connected" ? (
            /* 1. DISCONNECTED STATE - QR PAIRING BOARD */
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center">
              <div className="max-w-4xl w-full grid gap-6 md:grid-cols-2">
                {/* How to Connect instructions */}
                <Card className="rounded-2xl border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1e293b]/40 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-sm">
                  <CardHeader className="border-b border-slate-200 dark:border-white/[0.06] p-6 bg-slate-100/50 dark:bg-[#111827]/60">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-[#f8fafc]">
                      <Smartphone className="h-4.5 w-4.5 text-[#6366f1]" />
                      Conectar Novo Aparelho
                    </CardTitle>
                    <CardDescription className="text-[9px] text-slate-500 dark:text-[#94a3b8] font-bold uppercase tracking-wider">
                      Integração Baileys / Evolution Gateway
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-xs text-slate-600 dark:text-[#94a3b8] leading-relaxed font-semibold">
                    <div className="space-y-3.5">
                      <div className="flex gap-3 items-start">
                        <span className="bg-[#6366f1] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                        <p className="text-slate-700 dark:text-slate-350">Gere a chave de pareamento para iniciar o motor virtual do WhatsApp no servidor alocado.</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <span className="bg-[#6366f1] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                        <p className="text-slate-700 dark:text-slate-350">No seu smartphone, abra o WhatsApp, acesse **Aparelhos Conectados &gt; Conectar um Aparelho**.</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <span className="bg-[#6366f1] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                        <p className="text-slate-700 dark:text-slate-350">Aponte a câmera para ler o QR Code exibido ao lado e parear instantaneamente.</p>
                      </div>
                    </div>

                    <div className="pt-6">
                      {wpp.status === "disconnected" ? (
                        <Button 
                          onClick={wpp.startConnectionFlow}
                          className="w-full h-11 rounded-xl text-xs font-bold bg-[#6366f1] hover:bg-[#7c3aed] text-white border-0 shadow active:scale-95 transition-transform"
                        >
                          Gerar QR Code de Conexão
                        </Button>
                      ) : (
                        <Button 
                          disabled
                          className="w-full h-11 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#1e293b] text-slate-500 dark:text-[#94a3b8] border-0"
                        >
                          {wpp.status === "generating" ? "Iniciando Container..." : "Pronto para Pareamento"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* QR Code Visualizer Container */}
                <Card className="rounded-2xl border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1e293b]/40 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-sm">
                  <CardHeader className="border-b border-slate-200 dark:border-white/[0.06] p-6 bg-slate-100/50 dark:bg-[#111827]/60">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-[#f8fafc]">
                      <MessageCircle className="h-4.5 w-4.5 text-[#6366f1]" />
                      Painel de Autenticação QR
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col items-center justify-center min-h-[320px]">
                    {wpp.status === "disconnected" && (
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                          <Smartphone className="h-6 w-6 text-slate-500 dark:text-[#94a3b8]" />
                        </div>
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Sem conexão active</h4>
                        <p className="text-[10px] text-slate-500 dark:text-[#94a3b8] max-w-xs font-semibold mx-auto leading-normal">
                          Inicie o pareamento do WhatsApp na central ao lado para gerar o QR code.
                        </p>
                      </div>
                    )}

                    {wpp.status === "generating" && (
                      <div className="text-center space-y-3">
                        <RefreshCw className="h-8 w-8 text-[#6366f1] animate-spin mx-auto" />
                        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Subindo instância virtual...</h4>
                        <p className="text-[10px] text-slate-500 dark:text-[#94a3b8] max-w-xs font-semibold mx-auto">
                          Alocando container e banco de dados SQLite temporário.
                        </p>
                      </div>
                    )}

                    {wpp.status === "scanning" && wpp.qrCodeVal && (
                      <div className="text-center space-y-5 w-full">
                        {/* Dynamic CSS Simulated QR code */}
                        <div className="relative mx-auto w-40 h-40 border border-slate-200 dark:border-white/[0.06] rounded-xl p-3 bg-white shadow-md flex items-center justify-center overflow-hidden">
                          {/* Scanning bar */}
                          <div className="absolute left-0 top-0 w-full h-1 bg-[#6366f1]/60 animate-bounce opacity-80" style={{ animationDuration: '3.5s' }} />
                          
                          <div className="grid grid-cols-6 gap-2 w-full h-full opacity-90 p-0.5">
                            <div className="border-[5px] border-slate-900 rounded-lg w-full h-full"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="border-[5px] border-slate-900 rounded-lg w-full h-full"></div>
                            
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-200 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-200 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-200 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-950 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-200 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-200 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            
                            <div className="border-[5px] border-slate-900 rounded-lg w-full h-full"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="bg-slate-900 rounded-sm"></div>
                            <div className="border-[5px] border-slate-900 rounded-lg w-full h-full"></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-350">Aponte seu celular para o monitor</h4>
                          <p className="text-[10px] text-[#6366f1] font-bold">
                            Chave expira em: {wpp.qrCountdown} segundos
                          </p>
                        </div>

                        <div className="pt-1 max-w-xs mx-auto">
                          <Button 
                            onClick={wpp.simulateScan}
                            className="w-full h-10 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow active:scale-95 transition-transform flex items-center justify-center gap-1.5"
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
            </div>
          ) : (
            /* 2. CONNECTED STATE - THREE PANE ENTERPRISE LIVE WORKSPACE */
            <div className="flex-1 flex overflow-hidden">
              
              {/* PANE 1: INBOX INTELIGENTE (Left sidebar - Chats) */}
              <div className="w-80 border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111827] flex flex-col shrink-0 transition-colors">
                {/* Search Inbox bar */}
                <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] shrink-0">
                  <div className="relative">
                    <Input 
                      placeholder="Filtrar conversas..." 
                      value={chatSearch}
                      onChange={e => setChatSearch(e.target.value)}
                      className="h-9 text-xs rounded-xl bg-slate-100 dark:bg-[#1e293b] border-slate-200 dark:border-white/[0.06] text-slate-800 dark:text-[#f8fafc] placeholder-slate-400 dark:placeholder-slate-500 pl-8 focus:border-[#6366f1]/50 focus:bg-white"
                    />
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {filteredChats.map(chat => {
                    const isActive = chat.id === wpp.activeChatId
                    return (
                      <button
                        key={chat.id}
                        onClick={() => wpp.setActiveChatId(chat.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-2 relative overflow-hidden",
                          isActive 
                            ? "bg-slate-100 dark:bg-[#273449] border-slate-200 dark:border-white/[0.08] shadow-sm text-slate-900 dark:text-[#f8fafc]" 
                            : "border-transparent hover:bg-slate-50 dark:hover:bg-[#273449]/40 bg-slate-100/30 dark:bg-[#1e293b]/20"
                        )}
                      >
                        {/* Selected Indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-0 w-1 h-full bg-[#6366f1]" />
                        )}

                        <div className="flex items-start gap-2.5">
                          {/* Avatar fallback */}
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#1e293b] border border-slate-300 dark:border-white/[0.06] flex items-center justify-center shrink-0 font-bold text-xs text-[#6366f1] relative">
                            {chat.clientName[0]}
                            {chat.unread && (
                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6366f1] rounded-full border-2 border-white dark:border-[#111827]" />
                            )}
                          </div>
                          
                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-800 dark:text-[#f8fafc] truncate">{chat.clientName}</span>
                              <span className="text-[8px] text-slate-500 dark:text-[#94a3b8] font-bold shrink-0">{chat.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-slate-655 dark:text-[#94a3b8] truncate mt-0.5 font-semibold leading-normal">{chat.lastMessage}</p>
                          </div>
                        </div>

                        {/* Badges and sentiment labels */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200 dark:border-white/[0.04] mt-1">
                          <Badge className={cn("text-[7.5px] font-bold uppercase px-1.5 py-0 h-4 border-none shadow-sm bg-slate-900/5 dark:bg-slate-900/10", chat.sentimentColor)}>
                            {chat.sentimentLabel}
                          </Badge>
                          <Badge className="bg-slate-100 dark:bg-[#1e293b]/85 text-slate-550 dark:text-[#94a3b8] border-none text-[7.5px] font-bold px-1.5 h-4">
                            Intenção: {Math.round(chat.intentScore * 100)}%
                          </Badge>
                          {chat.isAiActive && (
                            <Badge className="bg-[#6366f1]/10 text-[#6366f1] border-none text-[7.5px] font-bold px-1.5 h-4 flex items-center gap-0.5">
                              <Bot className="h-2.5 w-2.5 shrink-0" />
                              IA
                            </Badge>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* PANE 2: ACTIVE CHAT TIMELINE & Checkout visual */}
              <div className="flex-1 flex overflow-hidden border-r border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0f172a] transition-colors animate-all duration-300">
                {activeChat ? (
                  <div className="flex-1 flex overflow-hidden">
                    {/* Chat workspace */}
                    <div className="flex-1 flex flex-col justify-between h-full overflow-hidden min-w-0">
                      
                      {/* Chat Header */}
                      <div className="border-b border-slate-200 dark:border-white/[0.06] p-4 bg-white dark:bg-[#111827]/80 flex items-center justify-between shrink-0 transition-colors">
                        <div className="min-w-0 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center font-bold text-xs text-[#6366f1]">
                            {activeChat.clientName[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-[#f8fafc] flex items-center gap-1.5">
                              {activeChat.clientName}
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                            </h4>
                            <p className="text-[9px] text-slate-500 dark:text-[#94a3b8] font-mono">{activeChat.phone}</p>
                          </div>
                        </div>

                        {/* Controls: AI Switch + Disconnect */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* COLLAPSIBLE TOGGLE BUTTONS - Hides/shows right cart and CRM panel */}
                          <div className="flex items-center gap-1 border-r border-slate-200 dark:border-white/[0.06] pr-3 mr-1">
                            <Button
                              onClick={() => setIsCartOpen(!isCartOpen)}
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8 rounded-xl transition-all",
                                isCartOpen 
                                  ? "text-[#6366f1] bg-slate-100 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-white/[0.06]" 
                                  : "text-slate-400 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#1e293b]/40"
                              )}
                              title={isCartOpen ? "Ocultar Carrinho" : "Mostrar Carrinho"}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              onClick={() => setIsCrmOpen(!isCrmOpen)}
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8 rounded-xl transition-all",
                                isCrmOpen 
                                  ? "text-[#6366f1] bg-slate-100 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-white/[0.06]" 
                                  : "text-slate-400 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#1e293b]/40"
                              )}
                              title={isCrmOpen ? "Ocultar CRM & Telemetria" : "Mostrar CRM & Telemetria"}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#1e293b]/40 px-3 py-1.5 rounded-xl">
                            <div className="text-right">
                              <span className="text-[8px] font-bold uppercase text-slate-500 dark:text-[#94a3b8] block leading-none">IA Copilot</span>
                              <span className="text-[7.5px] text-slate-700 dark:text-[#f8fafc] font-bold">{activeChat.isAiActive ? "Autopilot" : "Manual"}</span>
                            </div>
                            <Switch 
                              checked={activeChat.isAiActive}
                              onCheckedChange={() => wpp.toggleAiChatbot(activeChat.id)}
                              className="data-[state=checked]:bg-[#6366f1] scale-90"
                            />
                          </div>

                          <Button 
                            onClick={wpp.disconnectDevice}
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl"
                            title="Desconectar"
                          >
                            <Smartphone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Chat Messages Stream */}
                      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-[#0f172a]">
                        {activeChat.messages.map((msg, i) => {
                          const isClient = msg.sender === "client"
                          const isAi = msg.sender === "ai"
                          const isSystem = msg.sender === "system"
                          
                          if (isSystem) {
                            return (
                              <div key={i} className="flex justify-center my-2">
                                <div className="bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-white/[0.04] text-slate-500 dark:text-[#94a3b8] font-mono text-[9px] px-3.5 py-1.5 rounded-xl text-center max-w-md flex items-center gap-1.5 shadow-sm">
                                  <Terminal className="h-3 w-3 text-amber-500 shrink-0" />
                                  <span>{msg.text}</span>
                                  <span className="text-slate-400 dark:text-[#94a3b8]/60 ml-1">({msg.timestamp})</span>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div 
                              key={i} 
                              className={cn(
                                "flex flex-col max-w-[76%] group",
                                isClient ? "mr-auto items-start animate-fade-in-left" : "ml-auto items-end animate-fade-in-right"
                              )}
                            >
                              <div 
                                className={cn(
                                  "p-3 rounded-2xl text-xs font-semibold leading-relaxed border",
                                  isClient 
                                    ? "bg-white dark:bg-[#1e293b] border-slate-200 dark:border-white/[0.06] text-slate-800 dark:text-[#f8fafc] rounded-tl-none shadow-sm" 
                                    : "bg-[#6366f1] border-none text-white rounded-tr-none shadow-sm shadow-[#6366f1]/10"
                                )}
                              >
                                {msg.text}

                                {/* Product recommendation attachments */}
                                {msg.attachment && (
                                  <div className="mt-2 p-2 bg-slate-100 dark:bg-[#111827]/40 rounded-lg border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-4">
                                    <div>
                                      <span className="text-[7px] font-bold uppercase tracking-wider block opacity-75">Encaminhado</span>
                                      <span className="text-[9.5px] font-bold block mt-0.5 text-slate-800 dark:text-[#f8fafc]">{msg.attachment.name}</span>
                                    </div>
                                    <span className="text-[9.5px] font-bold shrink-0 bg-[#6366f1]/10 dark:bg-[#6366f1]/20 px-2 py-0.5 rounded-md border border-[#6366f1]/20 text-[#6366f1]">R$ {msg.attachment.price.toFixed(2)}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1 mt-1 px-1.5 opacity-60">
                                {isAi && <Bot className="h-3 w-3 text-[#6366f1] shrink-0" />}
                                <span className="text-[7.5px] text-slate-400 dark:text-[#94a3b8] font-bold uppercase tracking-widest">{isAi ? "IA Copilot" : isClient ? "Cliente" : "Atendente"} • {msg.timestamp}</span>
                              </div>
                            </div>
                          )
                        })}

                        {/* Live Typing Indicator */}
                        {activeChat.isAiActive && activeChat.isAiTyping && (
                          <div className="flex flex-col max-w-[76%] mr-auto items-start">
                            <div className="p-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/[0.06] rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                              {/* Pulse dots */}
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span className="text-[9px] text-[#94a3b8] font-bold uppercase">IA está analisando...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Messaging inputs & catalog actions */}
                      <div className="border-t border-slate-200 dark:border-white/[0.06] p-3 bg-white dark:bg-[#111827]/80 space-y-2.5 shrink-0 transition-colors">
                        {/* Quick recommends options */}
                        <div className="flex gap-1.5 flex-wrap">
                          <Button 
                            onClick={() => wpp.sendMessage(activeChat.id, "Aqui está nosso Cardápio Gourmet de Hoje! Temos pratos executivos e sobremesas prontas.", { name: "Cardápio Principal GastroSaaS", price: 0, type: "menu" })}
                            variant="outline" 
                            className="rounded-xl h-7 px-2.5 text-[8.5px] font-bold gap-1 border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#1e293b]/40 text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] hover:bg-slate-200 dark:hover:bg-[#273449]"
                          >
                            🍔 Enviar Cardápio
                          </Button>
                          <Button 
                            onClick={() => wpp.sendMessage(activeChat.id, "Recomendo muito nossa Feijoada Completa Premium hoje! É o nosso prato principal campeão de vendas.", { name: "Feijoada Completa Premium", price: 49.90, type: "product" })}
                            variant="outline" 
                            className="rounded-xl h-7 px-2.5 text-[8.5px] font-bold gap-1 border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#1e293b]/40 text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] hover:bg-slate-200 dark:hover:bg-[#273449]"
                          >
                            🚀 Indicar Feijoada (Upsell)
                          </Button>
                          <Button 
                            onClick={() => wpp.sendMessage(activeChat.id, "Experimente nosso delicioso Pudim de Leite condensado artesanal por apenas R$ 12,90!", { name: "Pudim Artesanal", price: 12.90, type: "product" })}
                            variant="outline" 
                            className="rounded-xl h-7 px-2.5 text-[8.5px] font-bold gap-1 border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-[#1e293b]/40 text-slate-700 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f8fafc] hover:bg-slate-200 dark:hover:bg-[#273449]"
                          >
                            🍰 Indicar Sobremesa
                          </Button>
                        </div>

                        {/* Message box Form */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault()
                            const form = e.currentTarget
                            const input = form.elements.namedItem("msgText") as HTMLInputElement
                            if (input.value.trim()) {
                              wpp.sendMessage(activeChat.id, input.value.trim())
                              input.value = ""
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <Input 
                            name="msgText"
                            placeholder="Digite a mensagem..."
                            className="h-10 text-xs rounded-xl flex-1 bg-slate-50 dark:bg-[#1e293b] border-slate-200 dark:border-white/[0.06] text-slate-800 dark:text-[#f8fafc] placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#6366f1]/50 focus:bg-white"
                          />
                          <Button 
                            type="submit" 
                            className="h-10 w-10 shrink-0 rounded-xl bg-[#6366f1] hover:bg-[#7c3aed] text-white p-0 flex items-center justify-center border-0 active:scale-95 transition-all shadow shadow-[#6366f1]/10"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>

                    {/* MINI CHECKOUT / CART PREVIEW (Right-hand of chat workspace - COLLAPSIBLE) */}
                    {isCartOpen && (
                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 256, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="w-64 border-l border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111827] flex flex-col justify-between shrink-0 h-full overflow-hidden transition-colors"
                      >
                        <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-[#1e293b]/20 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <ShoppingCart className="h-4 w-4 text-[#6366f1]" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-[#94a3b8]">Carrinho</span>
                          </div>
                          
                          {/* Close Cart Button */}
                          <button 
                            onClick={() => setIsCartOpen(false)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            title="Recolher painel"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Items loop */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                          {activeChat.carrinhoVisual.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-3 space-y-2">
                              <ShoppingCart className="h-8 w-8 text-[#94a3b8]" />
                              <p className="text-[9px] font-bold text-slate-500 dark:text-[#94a3b8] leading-relaxed uppercase">
                                Carrinho Vazio.<br />A IA cria pedidos na conversa.
                              </p>
                            </div>
                          ) : (
                            activeChat.carrinhoVisual.map((item) => (
                              <div 
                                key={item.sku}
                                className="p-2.5 border border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#1e293b]/20 rounded-xl space-y-1.5 text-xs text-slate-700 dark:text-[#94a3b8]"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-[10.5px] text-slate-800 dark:text-[#f8fafc] truncate">{item.name}</span>
                                  <span className="text-[9.5px] font-bold text-slate-500 dark:text-[#94a3b8] shrink-0">R$ {item.price.toFixed(2)}</span>
                                </div>

                                {/* Operations: +/- and delete */}
                                <div className="flex items-center justify-between pt-1 border-t border-slate-250 dark:border-white/[0.04]">
                                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1e293b] rounded-lg p-0.5 border border-slate-200 dark:border-white/[0.06]">
                                    <button 
                                      onClick={() => wpp.updateCartItemQuantity(activeChat.id, item.sku, item.qty - 1)}
                                      className="p-1 hover:text-[#f8fafc] text-slate-555 rounded"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="font-bold text-[10px] text-slate-800 dark:text-[#f8fafc] w-4 text-center">{item.qty}</span>
                                    <button 
                                      onClick={() => wpp.updateCartItemQuantity(activeChat.id, item.sku, item.qty + 1)}
                                      className="p-1 hover:text-[#f8fafc] text-slate-555 rounded"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>

                                  <button 
                                    onClick={() => wpp.updateCartItemQuantity(activeChat.id, item.sku, 0)}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Total and confirm button */}
                        {activeChat.carrinhoVisual.length > 0 && (
                          <div className="p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#1e293b]/20 space-y-3 shrink-0">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#94a3b8] uppercase text-[9px]">Total</span>
                              <span className="font-bold text-slate-800 dark:text-white text-sm">
                                R$ {activeChat.carrinhoVisual.reduce((sum, i) => sum + (i.price * i.qty), 0).toFixed(2)}
                              </span>
                            </div>
                            
                            <Button 
                              onClick={() => wpp.confirmCartOrder(activeChat.id)}
                              className="w-full h-10 rounded-xl text-xs font-bold bg-[#6366f1] hover:bg-[#7c3aed] text-white border-0 shadow flex items-center justify-center gap-1.5 animate-pulse"
                            >
                              <Zap className="h-3.5 w-3.5" />
                              Confirmar & Enviar KDS
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center opacity-40">
                    <div className="space-y-2">
                      <MessageSquare className="h-8 w-8 text-[#94a3b8] mx-auto" />
                      <p className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Nenhuma inbox selecionada</p>
                    </div>
                  </div>
                )}
              </div>

              {/* PANE 3: TELEMETRY LOGS & CRM DATA PROFILE (Right side pane - COLLAPSIBLE) */}
              {isCrmOpen && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="w-80 border-l border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111827] flex flex-col shrink-0 transition-colors"
                >
                  {/* Switch tab */}
                  <div className="grid grid-cols-3 border-b border-slate-200 dark:border-white/[0.06] p-1 bg-slate-100 dark:bg-[#1e293b]/20 shrink-0">
                    <button 
                      onClick={() => setActiveRightPanel("crm")}
                      className={cn(
                        "py-2 text-[8px] font-bold uppercase tracking-widest rounded-xl transition-all",
                        activeRightPanel === "crm" ? "bg-white dark:bg-[#1e293b] text-slate-800 dark:text-[#f8fafc] border border-slate-200 dark:border-white/[0.04]" : "text-slate-500 dark:text-[#94a3b8] hover:text-[#f8fafc]"
                      )}
                    >
                      CRM Cliente
                    </button>
                    <button 
                      onClick={() => setActiveRightPanel("telemetry")}
                      className={cn(
                        "py-2 text-[8px] font-bold uppercase tracking-widest rounded-xl transition-all",
                        activeRightPanel === "telemetry" ? "bg-white dark:bg-[#1e293b] text-slate-800 dark:text-[#f8fafc] border border-slate-200 dark:border-white/[0.04]" : "text-slate-500 dark:text-[#94a3b8] hover:text-[#f8fafc]"
                      )}
                    >
                      Event Stream
                    </button>
                    <button 
                      onClick={() => setActiveRightPanel("metrics")}
                      className={cn(
                        "py-2 text-[8px] font-bold uppercase tracking-widest rounded-xl transition-all",
                        activeRightPanel === "metrics" ? "bg-white dark:bg-[#1e293b] text-slate-800 dark:text-[#f8fafc] border border-slate-200 dark:border-white/[0.04]" : "text-slate-500 dark:text-[#94a3b8] hover:text-[#f8fafc]"
                      )}
                    >
                      Métricas
                    </button>
                  </div>

                  {/* Panel contents */}
                  <div className="flex-1 overflow-y-auto p-4 relative">
                    {/* Floating Close Button for CRM panel */}
                    <button 
                      onClick={() => setIsCrmOpen(false)}
                      className="absolute top-1 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold p-1 bg-slate-100 dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-white/[0.06] flex items-center gap-0.5"
                      title="Ocultar Painel"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="pt-4 h-full">
                      <AnimatePresence mode="wait">
                        {activeRightPanel === "crm" && (
                          <motion.div 
                            key="crm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                          >
                            {activeChat ? (
                              <div className="space-y-4">
                                <div className="text-center pb-4 border-b border-slate-200 dark:border-white/[0.06]">
                                  <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center font-bold text-sm text-[#6366f1]">
                                    {activeChat.clientName[0]}
                                  </div>
                                  <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-2">{activeChat.clientName}</h4>
                                  <p className="text-[9px] text-[#94a3b8] font-mono mt-0.5">{activeChat.phone}</p>
                                </div>

                                {/* Info grid */}
                                <div className="space-y-3.5 text-xs text-slate-600 dark:text-[#94a3b8]">
                                  <div className="p-2.5 bg-slate-100/50 dark:bg-[#1e293b]/40 border border-slate-200 dark:border-white/[0.06] rounded-xl space-y-1 shadow-sm">
                                    <span className="text-[7.5px] font-bold uppercase text-slate-400 dark:text-slate-500 block tracking-wider">Perfil Operacional</span>
                                    <span className={cn("text-[9.5px] font-bold uppercase border-none rounded px-1.5 py-0.5", activeChat.sentimentColor)}>
                                      {activeChat.sentimentLabel}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2.5">
                                    <div className="p-2.5 bg-slate-100/50 dark:bg-[#1e293b]/40 border border-slate-200 dark:border-white/[0.06] rounded-xl shadow-sm">
                                      <span className="text-[7.5px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Ticket Médio</span>
                                      <strong className="text-slate-800 dark:text-slate-200 text-xs block mt-0.5">R$ {activeChat.ticketMedio.toFixed(2)}</strong>
                                    </div>
                                    <div className="p-2.5 bg-slate-100/50 dark:bg-[#1e293b]/40 border border-slate-200 dark:border-white/[0.06] rounded-xl shadow-sm">
                                      <span className="text-[7.5px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Frequência</span>
                                      <strong className="text-slate-800 dark:text-slate-200 text-xs block mt-0.5 truncate">{activeChat.frequencia}</strong>
                                    </div>
                                  </div>

                                  <div className="p-2.5 bg-slate-100/50 dark:bg-[#1e293b]/40 border border-slate-200/50 dark:border-white/[0.06] rounded-xl shadow-sm">
                                    <span className="text-[7.5px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Última Compra</span>
                                    <strong className="text-slate-800 dark:text-slate-200 text-xs block mt-0.5">{activeChat.ultimoPedido}</strong>
                                  </div>

                                  <div className="p-2.5 bg-slate-100/50 dark:bg-[#1e293b]/40 border border-slate-200/50 dark:border-white/[0.06] rounded-xl shadow-sm">
                                    <span className="text-[7.5px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Preferências de Compra</span>
                                    <p className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed mt-0.5">
                                      {activeChat.preferencia}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-400 dark:text-[#94a3b8] text-center py-20 italic text-xs font-semibold">
                                Selecione um contato para abrir o perfil operacional no CRM.
                              </div>
                            )}
                          </motion.div>
                        )}

                        {activeRightPanel === "telemetry" && (
                          <motion.div 
                            key="telemetry"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 h-full flex flex-col justify-between"
                          >
                            {/* Event stream console (Clean Supabase/Stripe observability CLI) */}
                            <div className="flex flex-col h-full bg-slate-100 dark:bg-[#1e293b]/40 border border-slate-200 dark:border-white/[0.06] rounded-xl p-3 font-mono text-[9px] leading-relaxed max-h-[440px] overflow-y-auto space-y-2">
                              <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-white/[0.06] pb-2 mb-2 text-slate-500 dark:text-[#94a3b8] font-bold shrink-0 uppercase tracking-widest text-[8px]">
                                <Terminal className="h-3.5 w-3.5 text-[#6366f1]" />
                                TELEMETRIA ENGINE LOGS
                              </div>
                              
                              {wpp.telemetryLogs.length === 0 ? (
                                <div className="text-slate-400 dark:text-[#94a3b8]/60 py-24 text-center italic leading-normal">
                                  Aguardando conexões...<br />
                                  Pareie o dispositivo para visualizar transmissões.
                                </div>
                              ) : (
                                wpp.telemetryLogs.map((log) => (
                                  <div key={log.id} className="flex items-start gap-1">
                                    <span className="text-slate-400 dark:text-slate-555 shrink-0">[{log.timestamp}]</span>
                                    <span className={cn(
                                      "break-words flex-1",
                                      log.type === "success" && "text-emerald-600 dark:text-emerald-400 font-semibold",
                                      log.type === "warning" && "text-amber-500 dark:text-amber-400",
                                      log.type === "ai" && "text-indigo-655 dark:text-indigo-400 font-semibold",
                                      log.type === "info" && "text-slate-500 dark:text-[#94a3b8]"
                                    )}>
                                      {log.message}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}

                        {activeRightPanel === "metrics" && (
                          <motion.div 
                            key="metrics"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                          >
                            <div className="grid gap-3 grid-cols-2">
                              <Card className="bg-slate-100/50 dark:bg-[#1e293b]/40 border-slate-200 dark:border-white/[0.06] rounded-xl p-3">
                                <span className="text-[7px] font-bold uppercase text-slate-500 dark:text-[#94a3b8] block">Faturamento</span>
                                <strong className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 block">R$ {wpp.metrics.totalSales.toFixed(2)}</strong>
                              </Card>
                              <Card className="bg-slate-100/50 dark:bg-[#1e293b]/40 border-slate-200 dark:border-white/[0.06] rounded-xl p-3">
                                <span className="text-[7px] font-bold uppercase text-slate-500 dark:text-[#94a3b8] block">Pedidos</span>
                                <strong className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 block">{wpp.metrics.totalOrders} novos</strong>
                              </Card>
                              <Card className="bg-slate-100/50 dark:bg-[#1e293b]/40 border-slate-200 dark:border-white/[0.06] rounded-xl p-3">
                                <span className="text-[7px] font-bold uppercase text-slate-500 dark:text-[#94a3b8] block">Conversão IA</span>
                                <strong className="text-xs font-bold text-[#6366f1] mt-0.5 block">{wpp.metrics.aiConversionRate}%</strong>
                              </Card>
                              <Card className="bg-slate-100/50 dark:bg-[#1e293b]/40 border-slate-200 dark:border-white/[0.06] rounded-xl p-3">
                                <span className="text-[7px] font-bold uppercase text-slate-500 dark:text-[#94a3b8] block">Abandono</span>
                                <strong className="text-xs font-bold text-red-500 dark:text-red-400 mt-0.5 block">{wpp.metrics.abandonmentRate}%</strong>
                              </Card>
                            </div>

                            {/* Conversão diagram container */}
                            <div className="p-3 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#1e293b]/20 rounded-xl text-[10px] space-y-2 text-[#94a3b8] shadow-sm">
                              <span className="font-bold uppercase text-[8px] tracking-wider text-slate-400 dark:text-slate-355 block">Atendimento por Canal</span>
                              <div className="space-y-1.5">
                                <div>
                                  <div className="flex justify-between font-bold text-[8.5px] mb-0.5 text-slate-600 dark:text-[#94a3b8]">
                                    <span>IA Copilot</span>
                                    <span>85%</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-200 dark:bg-[#1e293b] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#6366f1] rounded-full" style={{ width: '85%' }} />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between font-bold text-[8.5px] mb-0.5 text-slate-655 dark:text-[#94a3b8]">
                                    <span>Atendentes Humanos</span>
                                    <span>15%</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-200 dark:bg-[#1e293b] rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '15%' }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          )}

        </div>
      </div>
    </AppLayout>
  )
}
