"use client"

import * as React from "react"
import { integrationEventBus } from "@/services/integrations/integrations-engine"

export interface Message {
  id: string
  sender: "client" | "attendant" | "system" | "ai"
  text: string
  timestamp: string
  attachment?: {
    name: string
    price: number
    type: "product" | "menu"
  }
}

export interface CartItem {
  sku: string
  name: string
  price: number
  qty: number
}

export interface Chat {
  id: string
  clientName: string
  phone: string
  lastMessage: string
  timestamp: string
  unread: boolean
  isAiActive: boolean
  messages: Message[]
  
  // CRM Metadados
  intentScore: number // 0 to 1
  conversionProbability: string
  sentiment: "VIP" | "VIP Recorrente" | "VIP Hot" | "VIP Irritado" | "VIP Neutro"
  sentimentLabel: string
  sentimentColor: string
  vipStatus: boolean
  ticketMedio: number
  frequencia: string
  ultimoPedido: string
  preferencia: string
  
  // Active visual cart (Mini Checkout)
  carrinhoVisual: CartItem[]
  
  // Dynamic typing statuses
  isClientTyping?: boolean
  isAiTyping?: boolean
}

export type WhatsAppConnectionStatus = "disconnected" | "generating" | "scanning" | "connected"

export interface TelemetryLog {
  id: string
  timestamp: string
  type: "info" | "success" | "warning" | "ai"
  message: string
}

export function useWhatsApp() {
  const [status, setStatus] = React.useState<WhatsAppConnectionStatus>("disconnected")
  const [qrCodeVal, setQrCodeVal] = React.useState<string | null>(null)
  const [qrCountdown, setQrCountdown] = React.useState(30)
  const [chats, setChats] = React.useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null)
  const [autoStatusMessages, setAutoStatusMessages] = React.useState<string[]>([])
  
  // Live Supabase/Stripe-like Telemetry Logs
  const [telemetryLogs, setTelemetryLogs] = React.useState<TelemetryLog[]>([])
  
  // Dynamic Global Channel Metrics
  const [metrics, setMetrics] = React.useState({
    totalSales: 1845.90,
    totalOrders: 24,
    abandonmentRate: 12, // 12%
    aiConversionRate: 85, // 85%
    avgResponseTimeAi: "1.6s",
    avgResponseTimeHuman: "2.8 min"
  })

  // Add telemetry log helper
  const addTelemetryLog = (type: TelemetryLog["type"], message: string) => {
    const timeNow = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    setTelemetryLogs(prev => [
      { id: `tel-${Date.now()}-${Math.random()}`, timestamp: timeNow, type, message },
      ...prev
    ].slice(0, 15))
  }

  // Seed default chat values once connected
  const seedChats = () => {
    setChats([
      {
        id: "c1",
        clientName: "Guilherme Bastos",
        phone: "+55 (11) 98765-4321",
        lastMessage: "Oi, meu pedido já está sendo preparado?",
        timestamp: "19:12",
        unread: true,
        isAiActive: false,
        intentScore: 0.95,
        conversionProbability: "Alta (95%)",
        sentiment: "VIP Hot",
        sentimentLabel: "🔥 Cliente Quente",
        sentimentColor: "bg-red-500/10 text-red-500 border-red-500/20",
        vipStatus: true,
        ticketMedio: 68.90,
        frequencia: "2x por semana",
        ultimoPedido: "Hoje (19:12)",
        preferencia: "Hambúrguer, Adicionais duplos, Batata rústica",
        carrinhoVisual: [
          { sku: "HAM-001", name: "Burguer Artesanal Duplo", price: 34.90, qty: 1 },
          { sku: "SIDE-002", name: "Batata Rústica Canoa", price: 12.00, qty: 1 }
        ],
        messages: [
          { id: "m1", sender: "client", text: "Olá! Gostaria de saber sobre meu pedido.", timestamp: "19:10" },
          { id: "m2", sender: "attendant", text: "Olá, Guilherme! Vou verificar o status na cozinha agora mesmo.", timestamp: "19:11" },
          { id: "m3", sender: "client", text: "Oi, meu pedido já está sendo preparado?", timestamp: "19:12" },
        ]
      },
      {
        id: "c2",
        clientName: "Fernanda Limeira",
        phone: "+55 (11) 99888-7777",
        lastMessage: "Gostaria de ver as opções de sobremesa por favor.",
        timestamp: "18:45",
        unread: false,
        isAiActive: false,
        intentScore: 0.70,
        conversionProbability: "Média (70%)",
        sentiment: "VIP Recorrente",
        sentimentLabel: "👑 Cliente VIP",
        sentimentColor: "bg-violet-500/10 text-violet-500 border-violet-500/20",
        vipStatus: true,
        ticketMedio: 54.00,
        frequencia: "1x por semana",
        ultimoPedido: "Há 2 dias",
        preferencia: "Pratos executivos, Sucos naturais, Pudins",
        carrinhoVisual: [
          { sku: "EXE-003", name: "Grelhado de Frango Premium", price: 29.90, qty: 1 }
        ],
        messages: [
          { id: "m4", sender: "client", text: "Boa noite, vocês atendem delivery hoje?", timestamp: "18:40" },
          { id: "m5", sender: "attendant", text: "Boa noite! Sim, atendemos. Nosso tempo de entrega está em 40 minutos.", timestamp: "18:42" },
          { id: "m6", sender: "client", text: "Gostaria de ver as opções de sobremesa por favor.", timestamp: "18:45" },
        ]
      },
      {
        id: "c3",
        clientName: "Carlos Souza (IA Copilot)",
        phone: "+55 (11) 97654-3210",
        lastMessage: "Certo! A IA do GastroSaaS está pronta para lhe atender. Envie uma mensagem para iniciar.",
        timestamp: "19:15",
        unread: false,
        isAiActive: true,
        intentScore: 0.90,
        conversionProbability: "Alta (90%)",
        sentiment: "VIP Hot",
        sentimentLabel: "💰 Alta Chance",
        sentimentColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        vipStatus: false,
        ticketMedio: 49.90,
        frequencia: "Primeiro contato",
        ultimoPedido: "Nunca",
        preferencia: "Bebidas zero, Carnes nobres, Sobremesas",
        carrinhoVisual: [],
        messages: [
          { id: "m7", sender: "system", text: "IA Copilot Atendente Ativado para este contato.", timestamp: "19:15" },
          { id: "m8", sender: "ai", text: "Olá, Carlos! Sou a Inteligência Artificial do GastroSaaS. Posso tirar seu pedido, consultar nosso cardápio ou responder dúvidas. O que deseja saborear hoje?", timestamp: "19:15" }
        ]
      }
    ])
    setActiveChatId("c3")
    addTelemetryLog("success", "Sessão WhatsApp carregada. Instâncias Docker e BullMQ conectadas.")
    addTelemetryLog("info", "Iniciando processamento de mensagens em tempo real...")
  }

  // QR Code Expiration countdown timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (status === "scanning" && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown(prev => prev - 1)
      }, 1000)
    } else if (qrCountdown === 0 && status === "scanning") {
      setStatus("disconnected")
      setQrCodeVal(null)
      addTelemetryLog("warning", "Token de conexão expirado (Timeout QR).")
    }
    return () => clearInterval(timer)
  }, [status, qrCountdown])

  // Baileys Connection Simulator
  const startConnectionFlow = () => {
    setStatus("generating")
    addTelemetryLog("info", "Inicializando contêiner Docker do WhatsApp Engine (Baileys)...")
    setTimeout(() => {
      setStatus("scanning")
      setQrCountdown(30)
      setQrCodeVal(`2@uYw4728fgsd-${Date.now()}--EvolutionEngine`)
      addTelemetryLog("info", "QR Code gerado. Aguardando leitura no smartphone...")
    }, 1200)
  }

  // Simulate scanning of QR code
  const simulateScan = () => {
    setStatus("connected")
    setQrCodeVal(null)
    seedChats()
  }

  const disconnectDevice = () => {
    setStatus("disconnected")
    setChats([])
    setActiveChatId(null)
    setQrCodeVal(null)
    setTelemetryLogs([])
    addTelemetryLog("warning", "Conexão com o WhatsApp finalizada manualmente.")
  }

  // Live Chat send message
  const sendMessage = (chatId: string, text: string, attachment?: Message["attachment"]) => {
    const timeNow = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const newMsg: Message = {
          id: `msg-out-${Date.now()}`,
          sender: "attendant",
          text,
          timestamp: timeNow,
          attachment
        }
        
        // Add attachment item directly to the checkout cart visually!
        let updatedCart = [...chat.carrinhoVisual]
        if (attachment && attachment.type === "product") {
          const skuCode = `WPP-${attachment.name.substring(0, 3).toUpperCase()}`
          const existing = updatedCart.find(i => i.sku === skuCode)
          if (existing) {
            updatedCart = updatedCart.map(i => i.sku === skuCode ? { ...i, qty: i.qty + 1 } : i)
          } else {
            updatedCart.push({
              sku: skuCode,
              name: attachment.name,
              price: attachment.price,
              qty: 1
            })
          }
          addTelemetryLog("info", `Item adicionado ao carrinho via anexo comercial: ${attachment.name}`)
        }

        const updatedMsgs = [...chat.messages, newMsg]
        addTelemetryLog("info", `Atendente enviou mensagem para ${chat.clientName}`)
        
        // Trigger simulated AI auto-responses if AI is active
        if (chat.isAiActive && !attachment) {
          simulateAiResponse(chatId, text)
        }

        return {
          ...chat,
          lastMessage: text || (attachment ? `Anexo: ${attachment.name}` : ""),
          timestamp: timeNow,
          messages: updatedMsgs,
          carrinhoVisual: updatedCart
        }
      }
      return chat
    }))
  }

  // AI Chatbot Order & Upselling logic simulator
  const simulateAiResponse = (chatId: string, clientText: string) => {
    // Set AI Typing indicator
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isAiTyping: true } : c))
    addTelemetryLog("info", "IA analisando comportamento e detectando intenção...")

    setTimeout(() => {
      const timeNow = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      const lowerText = clientText.toLowerCase()
      
      let aiText = "Compreendi! Gostaria de adicionar alguma bebida refrescante (ex: Coca Cola Zero) ou sobremesa deliciosa (ex: Pudim artesanal) para acompanhar?"
      let attachment: Message["attachment"] | undefined = undefined
      let cartItemToAdd: CartItem | null = null

      if (lowerText.includes("feijoada") || lowerText.includes("prato") || lowerText.includes("comida")) {
        aiText = "Feijoada Completa Premium hoje está fantástica (R$ 49,90)! Lavei o arroz de couve fresquinho agora. Gostaria de confirmar essa delícia no seu carrinho?"
        attachment = {
          name: "Feijoada Completa Premium",
          price: 49.90,
          type: "product"
        }
        cartItemToAdd = { sku: "WPP-FEI", name: "Feijoada Completa Premium", price: 49.90, qty: 1 }
        addTelemetryLog("ai", "IA identificou intenção: ADICIONAR_CARRINHO (Feijoada)")
      } else if (lowerText.includes("coca") || lowerText.includes("refrigerante") || lowerText.includes("bebida")) {
        aiText = "Adicionei uma Coca Cola Zero trincando de gelada por R$ 6,50 ao seu pedido! Quer mais alguma coisa?"
        cartItemToAdd = { sku: "WPP-COC", name: "Coca Cola Zero Lata", price: 6.50, qty: 1 }
        addTelemetryLog("ai", "IA identificou intenção: ADICIONAR_CARRINHO (Coca Zero)")
      } else if (lowerText.includes("sobremesa") || lowerText.includes("doce") || lowerText.includes("pudim")) {
        aiText = "Que tal nosso famoso Pudim de leite condensado artesanal? Uma delícia irresistível por R$ 12,90!"
        attachment = {
          name: "Pudim Artesanal",
          price: 12.90,
          type: "product"
        }
        cartItemToAdd = { sku: "WPP-PUD", name: "Pudim Artesanal", price: 12.90, qty: 1 }
        addTelemetryLog("ai", "IA identificou intenção: ADICIONAR_CARRINHO (Pudim)")
      } else if (lowerText.includes("sim") || lowerText.includes("quero") || lowerText.includes("confirma")) {
        aiText = "Perfeito! Carrinho confirmado com sucesso via WhatsApp. O pedido foi enviado em tempo real para a cozinha (KDS). Você receberá notificações de preparo aqui!"
        addTelemetryLog("ai", "IA identificou intenção: CONFIRMAR_PEDIDO. Disparando evento KDS...")
        triggerMockChatbotOrder(chatId)
      } else if (lowerText.includes("obrigado") || lowerText.includes("vlw")) {
        aiText = "Por nada! A equipe GastroSaaS está à disposição. Bom apetite!"
      }

      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          const aiMsg: Message = {
            id: `msg-ai-${Date.now()}`,
            sender: "ai",
            text: aiText,
            timestamp: timeNow,
            attachment
          }
          
          let updatedCart = [...chat.carrinhoVisual]
          if (cartItemToAdd) {
            const existing = updatedCart.find(i => i.sku === cartItemToAdd!.sku)
            if (existing) {
              updatedCart = updatedCart.map(i => i.sku === cartItemToAdd!.sku ? { ...i, qty: i.qty + 1 } : i)
            } else {
              updatedCart.push(cartItemToAdd)
            }
          }

          return {
            ...chat,
            lastMessage: aiText,
            timestamp: timeNow,
            isAiTyping: false,
            carrinhoVisual: updatedCart,
            messages: [...chat.messages, aiMsg],
            intentScore: 0.98
          }
        }
        return chat
      }))
    }, 1500)
  }

  // Visual Cart Editing handlers
  const updateCartItemQuantity = (chatId: string, sku: string, quantity: number) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        let updatedCart = chat.carrinhoVisual
          .map(item => item.sku === sku ? { ...item, qty: quantity } : item)
          .filter(item => item.qty > 0)
        
        addTelemetryLog("info", `Carrinho alterado manualmente para ${chat.clientName}. Qtd SKU: ${sku} para ${quantity}`)
        return {
          ...chat,
          carrinhoVisual: updatedCart
        }
      }
      return chat
    }))
  }

  const addCartItem = (chatId: string, item: CartItem) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const existing = chat.carrinhoVisual.find(i => i.sku === item.sku)
        let updatedCart = [...chat.carrinhoVisual]
        if (existing) {
          updatedCart = updatedCart.map(i => i.sku === item.sku ? { ...i, qty: i.qty + item.qty } : i)
        } else {
          updatedCart.push(item)
        }
        addTelemetryLog("info", `Item adicionado ao carrinho: ${item.name}`)
        return {
          ...chat,
          carrinhoVisual: updatedCart
        }
      }
      return chat
    }))
  }

  const confirmCartOrder = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (!chat || chat.carrinhoVisual.length === 0) return

    addTelemetryLog("success", `Operador confirmou carrinho de ${chat.clientName} manualmente. Lançando no PDV & KDS...`)
    triggerMockChatbotOrder(chatId)
  }

  // Generate automated order creation from AI chatbot into the system KDS!
  const triggerMockChatbotOrder = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (!chat) return

    const orderId = `WPP-${Math.floor(1000 + Math.random() * 9000)}`
    
    // Publish creation event to the central EventBus (KDS will hear it!)
    const itemsMapped = chat.carrinhoVisual.map(item => ({
      sku: item.sku,
      name: item.name,
      quantity: item.qty,
      price: item.price,
      notes: "Pedida via Central WhatsApp"
    }))

    integrationEventBus.publish("REALTIME_ORDER_CREATED", {
      id: orderId,
      customerName: `${chat.clientName} (WhatsApp)`,
      items: itemsMapped.length > 0 ? itemsMapped : [{ sku: "WPP-AI-001", name: "Feijoada Completa [IA Bot]", quantity: 1, price: 49.90, notes: "Pedida via WhatsApp" }],
      createdAt: new Date().toISOString()
    })

    // Calculate billing
    const totalVal = chat.carrinhoVisual.reduce((sum, item) => sum + (item.price * item.qty), 0) || 49.90
    setMetrics(prev => ({
      ...prev,
      totalSales: prev.totalSales + totalVal,
      totalOrders: prev.totalOrders + 1
    }))

    // Empty cart visual once order is pushed
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          carrinhoVisual: []
        }
      }
      return c
    }))
  }

  // Toggle AI agent active state
  const toggleAiChatbot = (chatId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const nextState = !chat.isAiActive
        const timeNow = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        const systemMsg: Message = {
          id: `msg-sys-${Date.now()}`,
          sender: "system",
          text: nextState ? "IA Copilot Ativado no Autopilot." : "IA Desativada. Atendimento assumido pelo atendente.",
          timestamp: timeNow
        }
        addTelemetryLog("info", `Modo AI Copilot alterado para ${nextState ? "ATIVO" : "INATIVO"} no chat de ${chat.clientName}`)
        return {
          ...chat,
          isAiActive: nextState,
          messages: [...chat.messages, systemMsg]
        }
      }
      return chat
    }))
  }

  // Automated order status notification broadcast (Triggered from KDS!)
  const shootStatusMessage = (clientPhone: string, orderId: string, status: string) => {
    const timeNow = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    
    let statusText = `Seu pedido [${orderId}] foi recebido e está na fila.`
    if (status === "preparing") statusText = `🍳 Novidade! Seu pedido [${orderId}] já entrou em preparo com nossos chefs.`
    if (status === "ready") statusText = `🔔 Oba! Seu pedido [${orderId}] está pronto e aguardando retirada / saiu para entrega!`
    if (status === "delivered") statusText = `✅ Pedido [${orderId}] entregue com sucesso. Obrigado pela preferência!`

    // Add to simulated broadcast logs
    const logMsg = `[Status Trigger] WhatsApp enviado para ${clientPhone || "Guilherme Bastos"}: "${statusText}"`
    setAutoStatusMessages(prev => [logMsg, ...prev].slice(0, 10))
    addTelemetryLog("success", `Notificação de KDS enviada com sucesso: status do pedido [${orderId}] é [${status}]`)

    // Prepend to active chat timeline if exists
    setChats(prev => prev.map(chat => {
      if (chat.id === "c1") {
        const systemAlert: Message = {
          id: `msg-auto-${Date.now()}`,
          sender: "system",
          text: `[Mensagem Automática enviada]: ${statusText}`,
          timestamp: timeNow
        }
        return {
          ...chat,
          lastMessage: `Notificação: ${statusText}`,
          timestamp: timeNow,
          messages: [...chat.messages, systemAlert]
        }
      }
      return chat
    }))
  }

  // Listen to KDS changes globally inside useWhatsApp (highly decoupled via EventBus!)
  React.useEffect(() => {
    const unsubKdsChange = integrationEventBus.subscribe("KDS_STATUS_CHANGED", (data: { orderId: string; status: any }) => {
      shootStatusMessage("+55 (11) 98765-4321", data.orderId, data.status)
    })
    return () => unsubKdsChange()
  }, [])

  return {
    status,
    qrCodeVal,
    qrCountdown,
    chats,
    activeChatId,
    autoStatusMessages,
    telemetryLogs,
    metrics,
    startConnectionFlow,
    simulateScan,
    disconnectDevice,
    sendMessage,
    toggleAiChatbot,
    setActiveChatId,
    shootStatusMessage,
    updateCartItemQuantity,
    addCartItem,
    confirmCartOrder
  }
}
