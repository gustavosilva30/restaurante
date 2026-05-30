/**
 * GastroSaaS - Enterprise Integration Engine
 * A decoupled, event-driven, queue-based multi-marketplace integration service.
 * Supports webhooks, queues, workers, idempotency, retries, and realtime WebSocket-like gateways.
 */

export interface MarketplaceOrder {
  id: string
  merchantId: string
  customerName: string
  phone: string
  address: string
  items: {
    sku: string
    name: string
    quantity: number
    price: number
    notes?: string
  }[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  createdAt: string
  origin: "ifood" | "rappi" | "ubereats"
}

export interface WebhookJob {
  id: string
  eventId: string
  merchantId: string
  payload: any
  status: "pending" | "processing" | "completed" | "failed"
  latencyMs: number
  retryCount: number
  errorMessage?: string
  timestamp: string
}

export interface SKUProductMapping {
  productId: string
  productName: string
  marketplaceSku: string
  synced: boolean
  lastSynced: string
}

// 1. EVENT BUS (Event-driven system)
type EventCallback = (data: any) => void

class EventBus {
  private listeners: Record<string, EventCallback[]> = {}

  subscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  publish(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
    // Also publish to wildcard listeners if needed
    if (this.listeners["*"]) {
      this.listeners["*"].forEach(callback => callback({ event, data }))
    }
  }
}

export const integrationEventBus = new EventBus()

// 2. IDEMPOTENCY LAYER
class IdempotencyLayer {
  private processedEventIds = new Set<string>()

  isDuplicate(eventId: string): boolean {
    if (this.processedEventIds.has(eventId)) {
      return true
    }
    this.processedEventIds.add(eventId)
    // Keep set size reasonable (prune old events in real life)
    if (this.processedEventIds.size > 1000) {
      const first = Array.from(this.processedEventIds)[0]
      this.processedEventIds.delete(first)
    }
    return false
  }

  clear() {
    this.processedEventIds.clear()
  }
}

export const idempotencyLayer = new IdempotencyLayer()

// 3. MENU / SKU MAPPING
class CatalogSyncManager {
  private mappings: Record<string, SKUProductMapping[]> = {}

  getMappings(companyId: string): SKUProductMapping[] {
    if (!this.mappings[companyId]) {
      // Seed initial mappings
      this.mappings[companyId] = [
        { productId: "1", productName: "Feijoada Completa", marketplaceSku: "IFOOD-SKU-001", synced: true, lastSynced: "29/05/2026 18:00" },
        { productId: "2", productName: "Picanha na Chapa", marketplaceSku: "IFOOD-SKU-002", synced: true, lastSynced: "29/05/2026 18:00" },
        { productId: "3", productName: "Marmita P", marketplaceSku: "IFOOD-SKU-003", synced: true, lastSynced: "29/05/2026 18:00" },
        { productId: "7", productName: "Refrigerante Lata", marketplaceSku: "IFOOD-SKU-007", synced: false, lastSynced: "Nuncas" },
        { productId: "8", productName: "Suco Natural", marketplaceSku: "IFOOD-SKU-008", synced: true, lastSynced: "29/05/2026 18:00" },
      ]
    }
    return this.mappings[companyId]
  }

  updateMapping(companyId: string, productId: string, marketplaceSku: string) {
    const list = this.getMappings(companyId)
    const item = list.find(m => m.productId === productId)
    if (item) {
      item.marketplaceSku = marketplaceSku
      item.synced = true
      item.lastSynced = new Date().toLocaleString("pt-BR")
    }
    this.saveToStorage(companyId)
  }

  private saveToStorage(companyId: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(`sku_map_${companyId}`, JSON.stringify(this.mappings[companyId]))
    }
  }
}

export const catalogSyncManager = new CatalogSyncManager()

// 4. QUEUE SYSTEM (Redis Queue / BullMQ simulator)
class WebhookQueue {
  private jobs: WebhookJob[] = []
  private isProcessing = false

  getJobs(): WebhookJob[] {
    return this.jobs
  }

  addJob(job: Omit<WebhookJob, "status" | "latencyMs" | "retryCount" | "timestamp">) {
    const newJob: WebhookJob = {
      ...job,
      status: "pending",
      latencyMs: 0,
      retryCount: 0,
      timestamp: new Date().toLocaleTimeString("pt-BR")
    }
    this.jobs.unshift(newJob) // Add to top for visualization
    if (this.jobs.length > 50) {
      this.jobs.pop() // Keep last 50
    }
    
    integrationEventBus.publish("QUEUE_JOB_ADDED", newJob)

    // Trigger asynchronous worker processing
    this.processQueue()
  }

  private async processQueue() {
    if (this.isProcessing) return
    this.isProcessing = true

    // Process all pending jobs
    while (true) {
      const pendingJob = [...this.jobs].reverse().find(j => j.status === "pending")
      if (!pendingJob) break

      await this.processJob(pendingJob)
    }

    this.isProcessing = false
  }

  private async processJob(job: WebhookJob) {
    job.status = "processing"
    integrationEventBus.publish("QUEUE_JOB_PROCESSING", job)
    
    const startTime = Date.now()

    // Simulate network and database processing latency (200ms - 800ms)
    const processingDelay = 300 + Math.random() * 400
    await new Promise(resolve => setTimeout(resolve, processingDelay))

    // Validation & Deduplication checks inside the worker
    if (idempotencyLayer.isDuplicate(job.eventId)) {
      job.status = "failed"
      job.errorMessage = `Idempotency Conflict: Event [${job.eventId}] already processed.`
      job.latencyMs = Math.round(Date.now() - startTime)
      integrationEventBus.publish("QUEUE_JOB_FAILED", job)
      return
    }

    // Try processing the payload
    try {
      // Simulate random transient failures (10% chance) to showcase the Retry System
      const isFailedAttempt = Math.random() < 0.1 && job.retryCount < 2
      if (isFailedAttempt) {
        throw new Error("Temporary timeout database connection pool exhausted.")
      }

      // Successful processing - Persist to Database & Publish to Realtime WebSocket Gateway
      job.status = "completed"
      job.latencyMs = Math.round(Date.now() - startTime)
      
      integrationEventBus.publish("QUEUE_JOB_COMPLETED", job)
      
      // Dispatch Realtime Gateway Events
      if (job.payload.order) {
        integrationEventBus.publish("REALTIME_ORDER_CREATED", job.payload.order)
      }
      
    } catch (err: any) {
      // Retry System Logic
      job.retryCount++
      if (job.retryCount <= 2) {
        job.status = "pending" // Put back in queue
        job.errorMessage = `Attempt ${job.retryCount} failed: ${err.message}. Retrying in 3 seconds...`
        job.latencyMs = Math.round(Date.now() - startTime)
        integrationEventBus.publish("QUEUE_JOB_RETRIED", job)
        
        // Wait and retry
        setTimeout(() => {
          this.processQueue()
        }, 3000)
      } else {
        job.status = "failed"
        job.errorMessage = `DLQ (Dead Letter Queue): Max retries exceeded. Error: ${err.message}`
        job.latencyMs = Math.round(Date.now() - startTime)
        integrationEventBus.publish("QUEUE_JOB_FAILED", job)
      }
    }
  }

  clear() {
    this.jobs = []
    idempotencyLayer.clear()
  }
}

export const webhookQueue = new WebhookQueue()
