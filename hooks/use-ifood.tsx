"use client"

import * as React from "react"
import { 
  integrationEventBus, 
  webhookQueue, 
  idempotencyLayer, 
  catalogSyncManager, 
  WebhookJob, 
  SKUProductMapping,
  MarketplaceOrder
} from "@/services/integrations/integrations-engine"

export interface IntegrationLog {
  id: string
  type: "info" | "success" | "warning" | "error"
  message: string
  timestamp: string
}

export function useIFood() {
  const [isConnected, setIsConnected] = React.useState(false)
  const [merchantId, setMerchantId] = React.useState("IF-9482")
  const [clientId, setClientId] = React.useState("")
  const [clientSecret, setClientSecret] = React.useState("")
  const [jobs, setJobs] = React.useState<WebhookJob[]>([])
  const [logs, setLogs] = React.useState<IntegrationLog[]>([])
  
  // Realtime observability indicators
  const [latency, setLatency] = React.useState(0)
  const [successCount, setSuccessCount] = React.useState(0)
  const [failureCount, setFailureCount] = React.useState(0)
  const [skuMappings, setSkuMappings] = React.useState<SKUProductMapping[]>([])

  // Load mappings and initial stats
  React.useEffect(() => {
    setSkuMappings(catalogSyncManager.getMappings("1"))
    setJobs(webhookQueue.getJobs())
    
    // Add default initial logs
    setLogs([
      { id: "1", type: "info", message: "iFood Provider initialized. Awaiting credentials.", timestamp: new Date().toLocaleTimeString() }
    ])
  }, [])

  // Listen to the Integrations EventBus in real-time
  React.useEffect(() => {
    const unsubAdded = integrationEventBus.subscribe("QUEUE_JOB_ADDED", (job: WebhookJob) => {
      setJobs([...webhookQueue.getJobs()])
      addLog("info", `Webhook received: Event [${job.eventId}] added to Redis queue.`)
    })

    const unsubProcessing = integrationEventBus.subscribe("QUEUE_JOB_PROCESSING", (job: WebhookJob) => {
      setJobs([...webhookQueue.getJobs()])
      addLog("info", `Worker picking up event [${job.eventId}] for processing.`)
    })

    const unsubRetried = integrationEventBus.subscribe("QUEUE_JOB_RETRIED", (job: WebhookJob) => {
      setJobs([...webhookQueue.getJobs()])
      addLog("warning", `${job.errorMessage}`)
    })

    const unsubCompleted = integrationEventBus.subscribe("QUEUE_JOB_COMPLETED", (job: WebhookJob) => {
      setJobs([...webhookQueue.getJobs()])
      setSuccessCount(prev => prev + 1)
      
      // Update latency average
      setLatency(prev => {
        if (prev === 0) return job.latencyMs
        return Math.round((prev + job.latencyMs) / 2)
      })

      addLog("success", `Event [${job.eventId}] processed. Saved to DB, realtime broadcast dispatched! [${job.latencyMs}ms]`)
    })

    const unsubFailed = integrationEventBus.subscribe("QUEUE_JOB_FAILED", (job: WebhookJob) => {
      setJobs([...webhookQueue.getJobs()])
      setFailureCount(prev => prev + 1)
      addLog("error", `Event processing rejected: ${job.errorMessage}`)
    })

    return () => {
      unsubAdded()
      unsubProcessing()
      unsubRetried()
      unsubCompleted()
      unsubFailed()
    }
  }, [])

  const addLog = (type: IntegrationLog["type"], message: string) => {
    const newLog: IntegrationLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString("pt-BR")
    }
    setLogs(prev => [newLog, ...prev].slice(0, 100))
  }

  const connectStore = (mId: string, cId: string, cSec: string) => {
    if (!mId || !cId || !cSec) return false
    
    // Simulate oauth token handshakes
    addLog("info", "Starting OAuth 2.0 handshake with iFood Auth Server...")
    setTimeout(() => {
      setIsConnected(true)
      setMerchantId(mId)
      setClientId(cId)
      setClientSecret(cSec)
      addLog("success", `Connected successfully! Access token retrieved for Merchant ID [${mId}] (Expires in 23h59m).`)
    }, 1000)
    return true
  }

  const disconnectStore = () => {
    setIsConnected(false)
    setClientId("")
    setClientSecret("")
    webhookQueue.clear()
    setJobs([])
    setSuccessCount(0)
    setFailureCount(0)
    setLatency(0)
    addLog("warning", "iFood connection terminated by the merchant.")
  }

  // Trigger Menu Catalog Sync
  const triggerMenuSync = async () => {
    addLog("info", "Initiating bidirectional catalog synchronization...")
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Set all mapping synced status to true
    skuMappings.forEach(m => {
      m.synced = true
      m.lastSynced = new Date().toLocaleString("pt-BR")
    })
    setSkuMappings([...skuMappings])
    
    integrationEventBus.publish("IFOOD_MENU_SYNC", skuMappings)
    addLog("success", `Catalog sync completed successfully! ${skuMappings.length} products mapped and synchronized.`)
  }

  // Simulate an incoming webhook payload
  const simulateIncomingWebhook = (template: "burger" | "pizza" | "coke") => {
    if (!isConnected) {
      addLog("error", "Simulação bloqueada: A conexão com o iFood precisa estar ativa.")
      return
    }

    const eventId = `ev-${Math.floor(100000 + Math.random() * 900000)}`
    const orderId = `IFOOD-${Math.floor(1000 + Math.random() * 9000)}`

    let orderPayload: MarketplaceOrder = {
      id: orderId,
      merchantId,
      customerName: "Ricardo Santos",
      phone: "(11) 98765-4321",
      address: "Alameda Lorena, 1500 - Ap 42 - Jardins",
      items: [],
      subtotal: 0,
      deliveryFee: 8.50,
      total: 0,
      paymentMethod: "PIX",
      createdAt: new Date().toISOString(),
      origin: "ifood"
    }

    if (template === "burger") {
      orderPayload.customerName = "Guilherme Bastos"
      orderPayload.items = [
        { sku: "IFOOD-SKU-001", name: "Feijoada Completa", quantity: 1, price: 49.90, notes: "Sem cebola" },
        { sku: "IFOOD-SKU-008", name: "Suco Natural", quantity: 2, price: 9.90, notes: "Laranja sem açúcar" }
      ]
    } else if (template === "pizza") {
      orderPayload.customerName = "Fernanda Limeira"
      orderPayload.items = [
        { sku: "IFOOD-SKU-002", name: "Picanha na Chapa", quantity: 1, price: 79.90, notes: "Carne ao ponto" }
      ]
    } else {
      orderPayload.customerName = "Ana Paula Cruz"
      orderPayload.items = [
        { sku: "IFOOD-SKU-003", name: "Marmita P", quantity: 2, price: 18.90 }
      ]
    }

    const subtotal = orderPayload.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    orderPayload.subtotal = subtotal
    orderPayload.total = subtotal + orderPayload.deliveryFee

    // Send payload to Webhook Queue Simulator
    webhookQueue.addJob({
      id: `job-${Date.now()}`,
      eventId,
      merchantId,
      payload: {
        eventType: "ORDER_CREATED",
        orderId,
        eventId,
        merchantId,
        order: orderPayload
      }
    })
  }

  // Force simulation of duplicate Event ID (Idempotency testing)
  const simulateDuplicateWebhook = () => {
    if (jobs.length === 0) {
      addLog("error", "Nenhum evento registrado na fila para duplicar. Simule um pedido primeiro!")
      return
    }

    // Grab the first job
    const targetJob = jobs[0]
    addLog("warning", `Force-resending Event ID [${targetJob.eventId}] to test idempotency layer...`)

    webhookQueue.addJob({
      id: `job-dup-${Date.now()}`,
      eventId: targetJob.eventId,
      merchantId: targetJob.merchantId,
      payload: targetJob.payload
    })
  }

  const clearQueue = () => {
    webhookQueue.clear()
    setJobs([])
    setSuccessCount(0)
    setFailureCount(0)
    setLatency(0)
    addLog("info", "Observability metrics and event history reset.")
  }

  return {
    isConnected,
    merchantId,
    clientId,
    clientSecret,
    jobs,
    logs,
    latency,
    successCount,
    failureCount,
    skuMappings,
    connectStore,
    disconnectStore,
    triggerMenuSync,
    simulateIncomingWebhook,
    simulateDuplicateWebhook,
    clearQueue
  }
}
