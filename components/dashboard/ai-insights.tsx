"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  ShoppingBag,
  Clock,
  Lightbulb,
  ArrowUpRight,
  TrendingDown,
  ShoppingBasket,
  Percent,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AIInsight {
  id: string
  category: "sales" | "traffic" | "purchase" | "waste"
  title: string
  description: string
  impact: string
  impactType: "positive" | "warning" | "neutral"
  icon: React.ElementType
}

const mockAIInsights: AIInsight[] = [
  {
    id: "in-1",
    category: "traffic",
    title: "Previsão de Movimento Elevado",
    description: "Estimativa de fluxo 18% maior hoje entre 12h00 e 13h30 impulsionada por temperatura favorável (24°C) e evento corporativo próximo. Recomendado escalar 2 atendentes adicionais no salão.",
    impact: "+18% fluxo",
    impactType: "positive",
    icon: TrendingUp,
  },
  {
    id: "in-2",
    category: "purchase",
    title: "Sugestão de Compra Picanha",
    description: "Ritmo de saída de Picanha aumentou 32% nos últimos 3 dias. Estoque atual (8kg) atingirá ponto de ruptura amanhã às 20h00. Recomendamos reabastecer 15kg hoje.",
    impact: "Comprar 15kg",
    impactType: "warning",
    icon: ShoppingBasket,
  },
  {
    id: "in-3",
    category: "waste",
    title: "Alerta de Desperdício Self-Service",
    description: "Análise histórica indica que quintas-feiras registram média de 8.5% de sobra excedente no buffet de saladas. Sugerimos reduzir a reposição inicial em 3kg pós-13h00.",
    impact: "-8.5% desperdício",
    impactType: "warning",
    icon: TrendingDown,
  },
  {
    id: "in-4",
    category: "sales",
    title: "Meta de Faturamento Diário",
    description: "IA projeta faturamento de R$ 13.800,00 hoje (92% de confiança). Há uma oportunidade de atingir R$ 15.000,00 ativando combos promocionais de sobremesa no delivery pós-14h00.",
    impact: "+R$ 1.200,00 proj.",
    impactType: "positive",
    icon: Sparkles,
  },
]

const profitableProducts = [
  { name: "Petit Gateau com Sorvete", margin: "82%", profit: "R$ 23,80", giro: "Altíssimo", color: "bg-pink-500/10 text-pink-500" },
  { name: "Suco de Laranja Natural", margin: "85%", profit: "R$ 8,40", giro: "Altíssimo", color: "bg-amber-500/10 text-amber-500" },
  { name: "Risoto Tartufado Nobre", margin: "78%", profit: "R$ 61,60", giro: "Alto", color: "bg-indigo-500/10 text-indigo-500" },
  { name: "Feijoada Executiva M", margin: "72%", profit: "R$ 36,00", giro: "Alto", color: "bg-emerald-500/10 text-emerald-500" },
]

export function AIInsightsWidget() {
  const [activeTab, setActiveTab] = React.useState<"insights" | "forecast" | "profit">("insights")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="col-span-full"
    >
      <Card className="border border-slate-200/50 dark:border-muted/30 bg-white/70 dark:bg-card/40 backdrop-blur-md shadow-lg rounded-[32px] overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-muted/20 p-5 bg-gradient-to-r from-slate-50 to-white dark:from-muted/10 dark:to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Header branding */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center animate-pulse">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
                  Antigravity AI Insights
                  <Badge variant="secondary" className="bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border-none text-[9px] font-black uppercase">Mecanismo Ativo</Badge>
                </CardTitle>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Predições analíticas e automação de decisões em tempo real</p>
              </div>
            </div>

            {/* Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-muted rounded-2xl border w-max self-start sm:self-center">
              <button
                onClick={() => setActiveTab("insights")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                  activeTab === "insights" ? "bg-white dark:bg-card shadow-md text-indigo-600 dark:text-indigo-400 font-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Lightbulb className="h-4 w-4" />
                <span>Insights</span>
              </button>
              <button
                onClick={() => setActiveTab("forecast")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                  activeTab === "forecast" ? "bg-white dark:bg-card shadow-md text-indigo-600 dark:text-indigo-400 font-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="h-4 w-4" />
                <span>Previsões</span>
              </button>
              <button
                onClick={() => setActiveTab("profit")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95",
                  activeTab === "profit" ? "bg-white dark:bg-card shadow-md text-indigo-600 dark:text-indigo-400 font-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Percent className="h-4 w-4" />
                <span>Lucratividade</span>
              </button>
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: AUTO INSIGHTS FEED */}
            {activeTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {mockAIInsights.map((insight, index) => {
                  const IconComp = insight.icon
                  
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-2xl border border-slate-100 dark:border-muted/20 bg-slate-50/50 dark:bg-card/20 shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all flex items-start gap-3 relative group"
                    >
                      <div className={cn(
                        "p-2.5 rounded-xl shrink-0 shadow-sm",
                        insight.category === "sales" ? "bg-emerald-500/10 text-emerald-500" :
                        insight.category === "purchase" ? "bg-amber-500/10 text-amber-500" :
                        insight.category === "waste" ? "bg-rose-500/10 text-rose-500" :
                        "bg-indigo-500/10 text-indigo-500"
                      )}>
                        <IconComp className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{insight.title}</span>
                          <Badge
                            className={cn(
                              "text-[9px] font-extrabold uppercase border rounded-md px-1.5 py-0.5",
                              insight.impactType === "positive" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/15" :
                              insight.impactType === "warning" ? "bg-amber-500/5 text-amber-500 border-amber-500/15" :
                              "bg-indigo-500/5 text-indigo-500 border-indigo-500/15"
                            )}
                          >
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                          {insight.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* TAB 2: AI FORECAST TIMELINES */}
            {activeTab === "forecast" && (
              <motion.div
                key="forecast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-3"
              >
                {/* sales predictions card */}
                <div className="p-5 border border-slate-100 dark:border-muted/20 bg-slate-50/50 dark:bg-card/20 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Previsão Faturamento (Hoje)</span>
                    <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">R$ 14.250,00</h4>
                    <p className="text-[9px] text-muted-foreground font-bold mt-1">Nível de Confiança da Projeção: <strong className="text-emerald-500 font-extrabold">94%</strong></p>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground font-semibold leading-tight">Projeção calculada com base na média dos últimos 4 domingos, clima atual e reservas salvas.</p>
                </div>

                {/* peak hour timeline forecast */}
                <div className="p-5 border border-slate-100 dark:border-muted/20 bg-slate-50/50 dark:bg-card/20 rounded-2xl space-y-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Curva de Movimento Projetada</span>
                    <Clock className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                  </div>

                  {/* Horizontal projected peak timeline */}
                  <div className="flex items-end justify-between h-20 pt-2 pb-1 border-b">
                    {[
                      { hour: "11h", density: 20, active: false },
                      { hour: "12h", density: 85, active: true },
                      { hour: "13h", density: 95, active: true },
                      { hour: "14h", density: 60, active: false },
                      { hour: "18h", density: 30, active: false },
                      { hour: "19h", density: 75, active: false },
                      { hour: "20h", density: 85, active: false },
                      { hour: "21h", density: 45, active: false },
                    ].map((t) => (
                      <div key={t.hour} className="flex flex-col items-center gap-1.5 flex-1 select-none">
                        <div className="w-full px-1 sm:px-2">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${t.density}%` }}
                            transition={{ duration: 0.8 }}
                            className={cn(
                              "w-full rounded-t-lg shadow-sm min-h-[4px]",
                              t.active ? "bg-gradient-to-t from-indigo-600 to-indigo-500 dark:from-indigo-500" : "bg-slate-300 dark:bg-muted"
                            )}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground">{t.hour}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-muted-foreground font-semibold">
                    🔥 Horário Crítico de Atendimento estimado entre <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">12h15 e 13h40</strong>. Recomendável reforçar brigada do buffet.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 3: PROFITABLE PRODUCTS */}
            {activeTab === "profit" && (
              <motion.div
                key="profit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 sm:grid-cols-2 md:grid-cols-4"
              >
                {profitableProducts.map((p, idx) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 border border-slate-100 dark:border-muted/20 bg-slate-50/50 dark:bg-card/20 rounded-2xl space-y-3 shadow-sm hover:border-indigo-500/20 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 pr-2">{p.name}</span>
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 select-none", p.color)}>
                        {p.margin}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Retorno Líquido</span>
                        <span>Giro de Vendas</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-0.5">
                        <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{p.profit}</span>
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase">{p.giro}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
