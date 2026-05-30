"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AppLayout } from "@/components/layout/app-layout"

interface InventoryItem {
  id: string
  name: string
  unit: string
  quantity: number
  minQuantity: number
  price: number
  supplier: string
}

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [inventory, setInventory] = React.useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Busca dados dinamicamente do banco de dados na VPS
  React.useEffect(() => {
    async function loadInventory() {
      try {
        const res = await fetch("/api/inventory")
        if (res.ok) {
          const data = await res.json()
          setInventory(data)
        }
      } catch (err) {
        console.error("Erro ao carregar estoque:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadInventory()
  }, [])

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minQuantity)
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <AppLayout title="Controle de Estoque">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                <p className="text-3xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-3xl font-bold text-destructive">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">R$ {totalValue.toFixed(2).replace(".", ",")}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Movimentações Hoje</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <TrendingDown className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Entrada
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Saída
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Itens com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <Badge key={item.id} variant="outline" className="border-destructive text-destructive">
                    {item.name}: {item.quantity} {item.unit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventário</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item, index) => {
                  const stockLevel = (item.quantity / (item.minQuantity * 2)) * 100
                  const isLow = item.quantity <= item.minQuantity
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="group"
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <span className={cn(isLow && "text-destructive font-bold")}>
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.minQuantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-32">
                          <Progress
                            value={Math.min(stockLevel, 100)}
                            className={cn(
                              "h-2",
                              isLow ? "[&>div]:bg-destructive" : "[&>div]:bg-emerald-500"
                            )}
                          />
                          <span className="text-xs text-muted-foreground w-10">
                            {Math.min(stockLevel, 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>R$ {item.price.toFixed(2).replace(".", ",")}</TableCell>
                      <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Upload className="mr-2 h-4 w-4" />
                              Entrada
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Saída
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
