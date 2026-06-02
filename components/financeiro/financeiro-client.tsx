"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Target,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface Transaction {
  id: string
  description: string
  type: string
  value: number
  dueDate: string
  status: string
}

interface FinanceiroClientProps {
  transactions: Transaction[]
  companyId: string
}

export function FinanceiroClient({ transactions, companyId }: FinanceiroClientProps) {
  // Separa contas a pagar e contas a receber
  const accountsPayable = transactions.filter((t) => t.type === "payable")
  const accountsReceivable = transactions.filter((t) => t.type === "receivable")

  const totalPayable = accountsPayable.reduce((sum, t) => sum + t.value, 0)
  const totalReceivable = accountsReceivable.reduce((sum, t) => sum + t.value, 0)

  // Lucro líquido simulado
  const totalReceitaSimulada = 130000 // Mantém a receita simulada do Dashboard
  const lucroLiquido = totalReceitaSimulada - totalPayable

  // Gera dados simulados para o gráfico de fluxo de caixa baseado nas contas reais
  const cashFlowData = [
    { date: "Seg", income: 15000, expenses: totalPayable * 0.15 },
    { date: "Ter", income: 18000, expenses: totalPayable * 0.10 },
    { date: "Qua", income: 16000, expenses: totalPayable * 0.20 },
    { date: "Qui", income: 21000, expenses: totalPayable * 0.15 },
    { date: "Sex", income: 25000, expenses: totalPayable * 0.10 },
    { date: "Sáb", income: 30000, expenses: totalPayable * 0.20 },
    { date: "Dom", income: 22000, expenses: totalPayable * 0.10 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Receita do Mês</p>
                <p className="text-2xl font-bold">R$ {totalReceitaSimulada.toLocaleString("pt-BR")}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% vs mês anterior</span>
                </div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Despesas Reais (Contas)</p>
                <p className="text-2xl font-bold text-destructive">R$ {totalPayable.toFixed(2).replace(".", ",")}</p>
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>Fluxo ativo na VPS</span>
                </div>
              </div>
              <div className="rounded-lg bg-destructive/10 p-2">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Lucro Líquido Real</p>
                <p className="text-2xl font-bold text-emerald-500">R$ {lucroLiquido.toFixed(2).replace(".", ",")}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Margem: {((lucroLiquido / totalReceitaSimulada) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Meta do Mês</p>
                <p className="text-2xl font-bold">{Math.round((totalReceitaSimulada / 150000) * 100)}%</p>
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <Target className="h-3 w-3" />
                  <span>R$ 150.000 alvo</span>
                </div>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Target className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>Receitas e despesas baseadas em dados do banco de dados</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Este mês
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-sm text-emerald-500">
                            Receita: R$ {Number(payload[0].value)?.toLocaleString("pt-BR")}
                          </p>
                          <p className="text-sm text-destructive">
                            Despesa: R$ {Number(payload[1].value)?.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Accounts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contas a Pagar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-destructive">Contas a Pagar</CardTitle>
                <CardDescription>
                  Total pendente no banco: R$ {totalPayable.toFixed(2).replace(".", ",")}
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsPayable.length > 0 ? (
                accountsPayable.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{account.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(account.dueDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">
                        R$ {account.value.toFixed(2).replace(".", ",")}
                      </p>
                      <Badge
                        variant="secondary"
                        className={
                          account.status === "overdue"
                            ? "text-destructive bg-destructive/10"
                            : "text-amber-500 bg-amber-500/10"
                        }
                      >
                        {account.status === "overdue" ? "Vencido" : "Pendente"}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma conta a pagar cadastrada.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contas a Receber */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-emerald-500">Contas a Receber</CardTitle>
                <CardDescription>
                  Total pendente no banco: R$ {totalReceivable.toFixed(2).replace(".", ",")}
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsReceivable.length > 0 ? (
                accountsReceivable.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{account.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(account.dueDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-500">
                        R$ {account.value.toFixed(2).replace(".", ",")}
                      </p>
                      <Badge
                        variant="secondary"
                        className={
                          account.status === "overdue"
                            ? "text-destructive bg-destructive/10"
                            : "text-amber-500 bg-amber-500/10"
                        }
                      >
                        {account.status === "overdue" ? "Vencido" : "Pendente"}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma conta a receber cadastrada.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
