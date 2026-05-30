"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Factory,
  ClipboardList,
  Calculator,
  TrendingUp,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppLayout } from "@/components/layout/app-layout"

const fichasTecnicas = [
  {
    id: "1",
    name: "Feijoada Completa",
    portions: 50,
    cost: 12.5,
    salePrice: 49.9,
    margin: 75,
    ingredients: 8,
  },
  {
    id: "2",
    name: "Picanha na Chapa",
    portions: 30,
    cost: 25.0,
    salePrice: 79.9,
    margin: 68.7,
    ingredients: 5,
  },
  {
    id: "3",
    name: "Marmita Executiva",
    portions: 100,
    cost: 8.5,
    salePrice: 24.9,
    margin: 65.9,
    ingredients: 12,
  },
  {
    id: "4",
    name: "Frango Grelhado",
    portions: 40,
    cost: 10.0,
    salePrice: 34.9,
    margin: 71.3,
    ingredients: 6,
  },
]

const producaoDiaria = [
  { id: "1", name: "Arroz", planned: 10, produced: 8, unit: "kg", status: "in_progress" },
  { id: "2", name: "Feijão", planned: 8, produced: 8, unit: "kg", status: "completed" },
  { id: "3", name: "Farofa", planned: 5, produced: 3, unit: "kg", status: "in_progress" },
  { id: "4", name: "Vinagrete", planned: 3, produced: 0, unit: "kg", status: "pending" },
  { id: "5", name: "Carne Assada", planned: 15, produced: 15, unit: "kg", status: "completed" },
]

export default function ProducaoPage() {
  return (
    <AppLayout title="Controle de Produção">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Fichas Técnicas</p>
                <p className="text-3xl font-bold">{fichasTecnicas.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Custo Médio</p>
                <p className="text-2xl font-bold">R$ 14,00</p>
              </div>
              <Calculator className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Margem Média</p>
                <p className="text-3xl font-bold text-emerald-500">70.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Desperdício</p>
                <p className="text-3xl font-bold text-destructive">3.5%</p>
              </div>
              <Trash2 className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Fichas Técnicas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fichas Técnicas</CardTitle>
                  <CardDescription>Receitas e custos de produção</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Ficha
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fichasTecnicas.map((ficha, index) => (
                  <motion.div
                    key={ficha.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ficha.name}</span>
                        <Badge variant="secondary">{ficha.ingredients} ingredientes</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Custo: R$ {ficha.cost.toFixed(2).replace(".", ",")}</span>
                        <span>Venda: R$ {ficha.salePrice.toFixed(2).replace(".", ",")}</span>
                        <span>Porções: {ficha.portions}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Margem</p>
                        <p className="text-lg font-bold text-emerald-500">{ficha.margin.toFixed(1)}%</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Produção Diária */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Produção Diária</CardTitle>
                  <CardDescription>Acompanhamento em tempo real</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Factory className="mr-2 h-4 w-4" />
                  Nova Produção
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {producaoDiaria.map((item, index) => {
                  const progress = (item.produced / item.planned) * 100
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <Badge
                            variant="secondary"
                            className={
                              item.status === "completed"
                                ? "text-emerald-500 bg-emerald-500/10"
                                : item.status === "in_progress"
                                ? "text-amber-500 bg-amber-500/10"
                                : "text-muted-foreground"
                            }
                          >
                            {item.status === "completed"
                              ? "Concluído"
                              : item.status === "in_progress"
                              ? "Em andamento"
                              : "Pendente"}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.produced}/{item.planned} {item.unit}
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className={
                          progress === 100
                            ? "[&>div]:bg-emerald-500"
                            : progress > 50
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-blue-500"
                        }
                      />
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
