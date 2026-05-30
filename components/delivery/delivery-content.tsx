"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  User,
  Package,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Navigation,
  Bike,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { mockDeliveryOrders, mockDrivers } from "@/lib/mock-data"

type DeliveryStatus = "pending" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled"

interface DeliveryOrder {
  id: string
  customer: {
    name: string
    phone: string
    address: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  deliveryFee: number
  status: DeliveryStatus
  paymentMethod: string
  createdAt: Date
  estimatedDelivery: Date
  driver: { name: string; phone: string } | null
}

const statusConfig: Record<DeliveryStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pendente", color: "text-amber-500", bgColor: "bg-amber-500" },
  preparing: { label: "Preparando", color: "text-blue-500", bgColor: "bg-blue-500" },
  ready: { label: "Pronto", color: "text-emerald-500", bgColor: "bg-emerald-500" },
  delivering: { label: "Entregando", color: "text-violet-500", bgColor: "bg-violet-500" },
  delivered: { label: "Entregue", color: "text-muted-foreground", bgColor: "bg-muted-foreground" },
  cancelled: { label: "Cancelado", color: "text-destructive", bgColor: "bg-destructive" },
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

function getTimeDiff(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diff < 1) return "Agora"
  if (diff === 1) return "1 min"
  return `${diff} min`
}

export function DeliveryContent() {
  const [orders, setOrders] = React.useState<DeliveryOrder[]>(mockDeliveryOrders as DeliveryOrder[])
  const [selectedOrder, setSelectedOrder] = React.useState<DeliveryOrder | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("all")

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return order.status !== "delivered" && order.status !== "cancelled"
    if (activeTab === "pending") return order.status === "pending"
    if (activeTab === "preparing") return order.status === "preparing"
    if (activeTab === "ready") return order.status === "ready"
    if (activeTab === "delivering") return order.status === "delivering"
    if (activeTab === "history") return order.status === "delivered" || order.status === "cancelled"
    return true
  })

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivering: orders.filter((o) => o.status === "delivering").length,
  }

  const handleOrderClick = (order: DeliveryOrder) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  const updateOrderStatus = (orderId: string, newStatus: DeliveryStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    setDialogOpen(false)
  }

  const assignDriver = (orderId: string, driver: typeof mockDrivers[0]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, driver: { name: driver.name, phone: driver.phone }, status: "delivering" as DeliveryStatus }
          : order
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Preparando</p>
              <p className="text-3xl font-bold text-blue-500">{stats.preparing}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Prontos</p>
              <p className="text-3xl font-bold text-emerald-500">{stats.ready}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Em Entrega</p>
              <p className="text-3xl font-bold text-violet-500">{stats.delivering}</p>
            </div>
            <Truck className="h-8 w-8 text-violet-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos de Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start mb-4 overflow-x-auto">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="preparing">Preparando</TabsTrigger>
                  <TabsTrigger value="ready">Prontos</TabsTrigger>
                  <TabsTrigger value="delivering">Entregando</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3 pr-4">
                      <AnimatePresence mode="popLayout">
                        {filteredOrders.map((order, index) => {
                          const config = statusConfig[order.status]
                          return (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                              layout
                            >
                              <Card
                                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                                onClick={() => handleOrderClick(order)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold">{order.id}</span>
                                        <Badge className={cn(config.color, `${config.bgColor}/10`)}>
                                          {config.label}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <User className="h-3 w-3" />
                                        <span className="truncate">{order.customer.name}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{order.customer.address}</span>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          <span>{getTimeDiff(order.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <CreditCard className="h-3 w-3" />
                                          <span>{order.paymentMethod}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-primary">
                                        R$ {(order.total + order.deliveryFee).toFixed(2).replace(".", ",")}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        + R$ {order.deliveryFee.toFixed(2).replace(".", ",")} entrega
                                      </p>
                                    </div>
                                  </div>
                                  {order.driver && (
                                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm">
                                      <Bike className="h-4 w-4 text-primary" />
                                      <span>{order.driver.name}</span>
                                      <span className="text-muted-foreground">•</span>
                                      <span className="text-muted-foreground">{order.driver.phone}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>

                      {filteredOrders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                          <Truck className="h-12 w-12 mb-4" />
                          <p className="text-lg font-medium">Nenhum pedido encontrado</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bike className="h-5 w-5" />
              Entregadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3",
                    driver.status === "available"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        driver.status === "available" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    >
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.phone}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      driver.status === "available"
                        ? "text-emerald-500 bg-emerald-500/10"
                        : "text-amber-500 bg-amber-500/10"
                    )}
                  >
                    {driver.status === "available" ? "Disponível" : "Em entrega"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedOrder.id}
                  <Badge className={cn(statusConfig[selectedOrder.status].color, `${statusConfig[selectedOrder.status].bgColor}/10`)}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Pedido realizado às {formatTime(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{selectedOrder.customer.address}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <p className="font-medium">Itens do Pedido</p>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>R$ {item.price.toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {selectedOrder.total.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxa de entrega</span>
                      <span>R$ {selectedOrder.deliveryFee.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        R$ {(selectedOrder.total + selectedOrder.deliveryFee).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  <span>Pagamento: {selectedOrder.paymentMethod}</span>
                </div>

                {/* Driver Assignment */}
                {selectedOrder.status === "ready" && !selectedOrder.driver && (
                  <div className="space-y-2">
                    <p className="font-medium">Atribuir Entregador</p>
                    <div className="grid grid-cols-2 gap-2">
                      {mockDrivers
                        .filter((d) => d.status === "available")
                        .map((driver) => (
                          <Button
                            key={driver.id}
                            variant="outline"
                            onClick={() => assignDriver(selectedOrder.id, driver)}
                          >
                            <Bike className="mr-2 h-4 w-4" />
                            {driver.name}
                          </Button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedOrder.status === "pending" && (
                    <>
                      <Button onClick={() => updateOrderStatus(selectedOrder.id, "preparing")}>
                        <Package className="mr-2 h-4 w-4" />
                        Aceitar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Recusar
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === "preparing" && (
                    <Button
                      className="col-span-2"
                      onClick={() => updateOrderStatus(selectedOrder.id, "ready")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como Pronto
                    </Button>
                  )}
                  {selectedOrder.status === "delivering" && (
                    <Button
                      className="col-span-2 bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar Entrega
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
