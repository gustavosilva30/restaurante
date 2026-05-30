// Mock data for the restaurant management system - Enhanced for premium dashboard

export const mockCompanies = [
  {
    id: "1",
    name: "Restaurante Sabor & Arte",
    logo: "/placeholder-logo.png",
    domain: "saborearte",
    plan: "premium",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    phone: "(11) 99999-9999",
  },
  {
    id: "2",
    name: "Marmitaria Caseira",
    logo: "/placeholder-logo.png",
    domain: "marmitariacaseira",
    plan: "basic",
    address: "Rua das Flores, 500 - Rio de Janeiro, RJ",
    phone: "(21) 98888-8888",
  },
]

export const mockDashboardData = {
  // Real-time metrics
  salesOfDay: 12450.0,
  activeOrders: 23,
  occupiedTables: 12,
  totalTables: 20,
  revenue: 45780.0,
  averageTicket: 68.5,
  deliveryOrders: 18,
  kitchenProduction: 156,
  estimatedProfit: 15230.0,
  customersToday: 182,
  
  // Comparison data
  salesYesterday: 11067.0,
  revenueLastMonth: 38500.0,
  averageTicketLastWeek: 65.0,
  
  // Sales by day (last 7 days)
  salesByDay: [
    { day: "Seg", value: 8500, orders: 124, date: "20/01" },
    { day: "Ter", value: 9200, orders: 138, date: "21/01" },
    { day: "Qua", value: 10100, orders: 152, date: "22/01" },
    { day: "Qui", value: 11500, orders: 168, date: "23/01" },
    { day: "Sex", value: 14200, orders: 210, date: "24/01" },
    { day: "Sáb", value: 16800, orders: 245, date: "25/01" },
    { day: "Dom", value: 12450, orders: 182, date: "26/01" },
  ],
  
  // Hourly data for real-time chart
  hourlyData: [
    { hour: "06:00", sales: 0, orders: 0 },
    { hour: "07:00", sales: 250, orders: 4 },
    { hour: "08:00", sales: 580, orders: 8 },
    { hour: "09:00", sales: 420, orders: 6 },
    { hour: "10:00", sales: 680, orders: 10 },
    { hour: "11:00", sales: 1850, orders: 28 },
    { hour: "12:00", sales: 3200, orders: 48 },
    { hour: "13:00", sales: 2890, orders: 42 },
    { hour: "14:00", sales: 1450, orders: 21 },
    { hour: "15:00", sales: 620, orders: 9 },
    { hour: "16:00", sales: 380, orders: 5 },
    { hour: "17:00", sales: 540, orders: 8 },
    { hour: "18:00", sales: 1680, orders: 24 },
    { hour: "19:00", sales: 2950, orders: 43 },
    { hour: "20:00", sales: 3450, orders: 52 },
    { hour: "21:00", sales: 2180, orders: 32 },
    { hour: "22:00", sales: 850, orders: 12 },
  ],
  
  // Top products with more details
  topProducts: [
    { id: "1", name: "Feijoada Completa", quantity: 45, revenue: 2250, trend: 12, category: "Pratos" },
    { id: "2", name: "Picanha na Chapa", quantity: 38, revenue: 3040, trend: 8, category: "Pratos" },
    { id: "3", name: "Marmita Executiva G", quantity: 32, revenue: 1050, trend: -3, category: "Marmitas" },
    { id: "4", name: "Buffet Self-Service", quantity: 28, revenue: 1540, trend: 5, category: "Self-Service" },
    { id: "5", name: "Frango Grelhado", quantity: 25, revenue: 875, trend: 15, category: "Pratos" },
    { id: "6", name: "Prato Feito", quantity: 22, revenue: 506, trend: -2, category: "Pratos" },
    { id: "7", name: "Suco Natural", quantity: 68, revenue: 680, trend: 20, category: "Bebidas" },
    { id: "8", name: "Refrigerante Lata", quantity: 95, revenue: 665, trend: 5, category: "Bebidas" },
  ],
  
  // Peak hours heatmap data (day x hour)
  peakHoursHeatmap: [
    // [hour, dayOfWeek (0=dom, 6=sáb), intensity (0-100)]
    { hour: 11, day: 0, orders: 35, intensity: 45 },
    { hour: 12, day: 0, orders: 52, intensity: 68 },
    { hour: 13, day: 0, orders: 48, intensity: 62 },
    { hour: 19, day: 0, orders: 42, intensity: 55 },
    { hour: 20, day: 0, orders: 38, intensity: 50 },
    { hour: 11, day: 1, orders: 28, intensity: 36 },
    { hour: 12, day: 1, orders: 45, intensity: 58 },
    { hour: 13, day: 1, orders: 42, intensity: 55 },
    { hour: 19, day: 1, orders: 35, intensity: 45 },
    { hour: 20, day: 1, orders: 32, intensity: 42 },
    { hour: 11, day: 2, orders: 30, intensity: 39 },
    { hour: 12, day: 2, orders: 48, intensity: 62 },
    { hour: 13, day: 2, orders: 45, intensity: 58 },
    { hour: 19, day: 2, orders: 38, intensity: 50 },
    { hour: 20, day: 2, orders: 35, intensity: 45 },
    { hour: 11, day: 3, orders: 32, intensity: 42 },
    { hour: 12, day: 3, orders: 50, intensity: 65 },
    { hour: 13, day: 3, orders: 48, intensity: 62 },
    { hour: 19, day: 3, orders: 42, intensity: 55 },
    { hour: 20, day: 3, orders: 40, intensity: 52 },
    { hour: 11, day: 4, orders: 38, intensity: 50 },
    { hour: 12, day: 4, orders: 58, intensity: 75 },
    { hour: 13, day: 4, orders: 55, intensity: 72 },
    { hour: 19, day: 4, orders: 52, intensity: 68 },
    { hour: 20, day: 4, orders: 48, intensity: 62 },
    { hour: 11, day: 5, orders: 45, intensity: 58 },
    { hour: 12, day: 5, orders: 72, intensity: 94 },
    { hour: 13, day: 5, orders: 68, intensity: 88 },
    { hour: 19, day: 5, orders: 65, intensity: 85 },
    { hour: 20, day: 5, orders: 70, intensity: 91 },
    { hour: 21, day: 5, orders: 55, intensity: 72 },
    { hour: 11, day: 6, orders: 42, intensity: 55 },
    { hour: 12, day: 6, orders: 65, intensity: 85 },
    { hour: 13, day: 6, orders: 60, intensity: 78 },
    { hour: 19, day: 6, orders: 55, intensity: 72 },
    { hour: 20, day: 6, orders: 58, intensity: 75 },
  ],
  
  // Peak hours simple
  peakHours: [
    { hour: "11h", orders: 28, revenue: 1850 },
    { hour: "12h", orders: 48, revenue: 3200 },
    { hour: "13h", orders: 42, revenue: 2890 },
    { hour: "14h", orders: 21, revenue: 1450 },
    { hour: "18h", orders: 24, revenue: 1680 },
    { hour: "19h", orders: 43, revenue: 2950 },
    { hour: "20h", orders: 52, revenue: 3450 },
    { hour: "21h", orders: 32, revenue: 2180 },
  ],
  
  // Revenue by category
  revenueByCategory: [
    { name: "Pratos Principais", value: 6500, percentage: 45 },
    { name: "Marmitas", value: 3200, percentage: 22 },
    { name: "Self-Service", value: 2400, percentage: 17 },
    { name: "Bebidas", value: 1500, percentage: 10 },
    { name: "Sobremesas", value: 850, percentage: 6 },
  ],
  
  // Payment methods
  paymentMethods: [
    { method: "PIX", value: 4980, percentage: 40, color: "#00D4AA" },
    { method: "Cartão Crédito", value: 3735, percentage: 30, color: "#6366F1" },
    { method: "Cartão Débito", value: 2490, percentage: 20, color: "#8B5CF6" },
    { method: "Dinheiro", value: 1245, percentage: 10, color: "#F59E0B" },
  ],
  
  // AI Predictions
  predictions: {
    expectedRevenue: 14200,
    confidence: 87,
    peakHourToday: "12:30",
    expectedCustomers: 195,
    suggestedStaff: 8,
    weatherImpact: "positivo",
    trend: "alta",
  },
  
  // Recent orders for live feed
  recentOrders: [
    { id: "ORD-001", table: 5, items: 3, total: 89.70, status: "preparing", time: "2 min" },
    { id: "ORD-002", table: null, items: 2, total: 65.80, status: "delivering", time: "5 min", isDelivery: true },
    { id: "ORD-003", table: 12, items: 4, total: 156.40, status: "ready", time: "8 min" },
    { id: "ORD-004", table: 3, items: 2, total: 45.90, status: "completed", time: "12 min" },
    { id: "ORD-005", table: null, items: 5, total: 198.50, status: "pending", time: "1 min", isDelivery: true },
    { id: "ORD-006", table: 8, items: 1, total: 32.90, status: "preparing", time: "3 min" },
  ],
  
  // Goals and targets
  goals: {
    dailySales: { target: 15000, current: 12450, percentage: 83 },
    monthlyRevenue: { target: 450000, current: 385000, percentage: 86 },
    customerSatisfaction: { target: 95, current: 92, percentage: 97 },
    averageTicket: { target: 75, current: 68.5, percentage: 91 },
  },
  
  // Staff performance
  staffPerformance: [
    { name: "Maria Silva", role: "Garçom", orders: 45, revenue: 3150, rating: 4.8 },
    { name: "João Santos", role: "Garçom", orders: 38, revenue: 2660, rating: 4.6 },
    { name: "Ana Costa", role: "Caixa", orders: 82, revenue: 5740, rating: 4.9 },
    { name: "Pedro Lima", role: "Garçom", orders: 32, revenue: 2240, rating: 4.5 },
  ],
}

export const mockCategories = [
  { id: "1", name: "Pratos Principais", icon: "🍽️", color: "#10b981" },
  { id: "2", name: "Marmitas", icon: "📦", color: "#f59e0b" },
  { id: "3", name: "Self-Service", icon: "🥗", color: "#3b82f6" },
  { id: "4", name: "Bebidas", icon: "🥤", color: "#8b5cf6" },
  { id: "5", name: "Sobremesas", icon: "🍰", color: "#ec4899" },
  { id: "6", name: "Lanches", icon: "🍔", color: "#ef4444" },
]

export const mockProducts = [
  {
    id: "1",
    name: "Feijoada Completa",
    description: "Feijoada tradicional com acompanhamentos",
    price: 49.9,
    categoryId: "1",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "2",
    name: "Picanha na Chapa",
    description: "Picanha grelhada com arroz, feijão e fritas",
    price: 79.9,
    categoryId: "1",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "3",
    name: "Marmita P",
    description: "Marmita pequena - 1 proteína + 2 acompanhamentos",
    price: 18.9,
    categoryId: "2",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "4",
    name: "Marmita M",
    description: "Marmita média - 1 proteína + 3 acompanhamentos",
    price: 24.9,
    categoryId: "2",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "5",
    name: "Marmita G",
    description: "Marmita grande - 2 proteínas + 4 acompanhamentos",
    price: 32.9,
    categoryId: "2",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "6",
    name: "Buffet por Kg",
    description: "Self-service variado por quilo",
    price: 54.9,
    categoryId: "3",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "7",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Fanta",
    price: 6.9,
    categoryId: "4",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "8",
    name: "Suco Natural",
    description: "Laranja, Limão, Abacaxi, Maracujá",
    price: 9.9,
    categoryId: "4",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "9",
    name: "Pudim",
    description: "Pudim de leite condensado",
    price: 12.9,
    categoryId: "5",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "10",
    name: "Mousse de Maracujá",
    description: "Mousse cremoso de maracujá",
    price: 14.9,
    categoryId: "5",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "11",
    name: "Frango Grelhado",
    description: "Filé de frango grelhado com legumes",
    price: 34.9,
    categoryId: "1",
    image: "/placeholder-food.png",
    available: true,
  },
  {
    id: "12",
    name: "Prato Feito",
    description: "Arroz, feijão, bife, ovo e salada",
    price: 22.9,
    categoryId: "1",
    image: "/placeholder-food.png",
    available: true,
  },
]

export const mockTables = [
  { id: "1", number: 1, capacity: 4, status: "free" as const, x: 50, y: 50 },
  { id: "2", number: 2, capacity: 4, status: "occupied" as const, x: 150, y: 50, currentOrder: "ORD001", totalAmount: 156.80, timeSeated: 45 },
  { id: "3", number: 3, capacity: 6, status: "occupied" as const, x: 250, y: 50, currentOrder: "ORD002", totalAmount: 245.50, timeSeated: 32 },
  { id: "4", number: 4, capacity: 2, status: "reserved" as const, x: 350, y: 50, reservationName: "João Silva", reservationTime: "19:30" },
  { id: "5", number: 5, capacity: 4, status: "free" as const, x: 50, y: 150 },
  { id: "6", number: 6, capacity: 8, status: "occupied" as const, x: 150, y: 150, currentOrder: "ORD003", totalAmount: 489.00, timeSeated: 68 },
  { id: "7", number: 7, capacity: 4, status: "closing" as const, x: 250, y: 150, currentOrder: "ORD004", totalAmount: 178.90, timeSeated: 95 },
  { id: "8", number: 8, capacity: 2, status: "free" as const, x: 350, y: 150 },
  { id: "9", number: 9, capacity: 4, status: "occupied" as const, x: 50, y: 250, currentOrder: "ORD005", totalAmount: 98.50, timeSeated: 15 },
  { id: "10", number: 10, capacity: 6, status: "free" as const, x: 150, y: 250 },
  { id: "11", number: 11, capacity: 4, status: "reserved" as const, x: 250, y: 250, reservationName: "Maria Santos", reservationTime: "20:00" },
  { id: "12", number: 12, capacity: 2, status: "occupied" as const, x: 350, y: 250, currentOrder: "ORD006", totalAmount: 67.80, timeSeated: 22 },
  { id: "13", number: 13, capacity: 4, status: "free" as const, x: 50, y: 350 },
  { id: "14", number: 14, capacity: 4, status: "occupied" as const, x: 150, y: 350, currentOrder: "ORD007", totalAmount: 134.60, timeSeated: 40 },
  { id: "15", number: 15, capacity: 6, status: "free" as const, x: 250, y: 350 },
  { id: "16", number: 16, capacity: 2, status: "reserved" as const, x: 350, y: 350, reservationName: "Pedro Souza", reservationTime: "21:00" },
  { id: "17", number: 17, capacity: 4, status: "free" as const, x: 50, y: 450 },
  { id: "18", number: 18, capacity: 8, status: "occupied" as const, x: 150, y: 450, currentOrder: "ORD008", totalAmount: 567.30, timeSeated: 55 },
  { id: "19", number: 19, capacity: 4, status: "free" as const, x: 250, y: 450 },
  { id: "20", number: 20, capacity: 2, status: "free" as const, x: 350, y: 450 },
]

export const mockKitchenOrders = [
  {
    id: "ORD001",
    table: 2,
    items: [
      { name: "Feijoada Completa", quantity: 2, notes: "Sem couve" },
      { name: "Picanha na Chapa", quantity: 1, notes: "Mal passada" },
    ],
    status: "preparing" as const,
    createdAt: new Date(Date.now() - 15 * 60000),
    priority: "normal" as const,
  },
  {
    id: "ORD002",
    table: 3,
    items: [
      { name: "Buffet por Kg", quantity: 4, notes: "" },
      { name: "Suco Natural", quantity: 4, notes: "Laranja" },
    ],
    status: "received" as const,
    createdAt: new Date(Date.now() - 5 * 60000),
    priority: "high" as const,
  },
  {
    id: "ORD003",
    table: 6,
    items: [
      { name: "Marmita G", quantity: 3, notes: "Frango desfiado" },
      { name: "Marmita M", quantity: 2, notes: "Bife acebolado" },
      { name: "Refrigerante Lata", quantity: 5, notes: "" },
    ],
    status: "preparing" as const,
    createdAt: new Date(Date.now() - 25 * 60000),
    priority: "normal" as const,
  },
  {
    id: "ORD004",
    table: 7,
    items: [
      { name: "Prato Feito", quantity: 2, notes: "" },
    ],
    status: "ready" as const,
    createdAt: new Date(Date.now() - 35 * 60000),
    priority: "normal" as const,
  },
  {
    id: "DEL001",
    table: null,
    isDelivery: true,
    customerName: "Carlos Oliveira",
    items: [
      { name: "Marmita G", quantity: 2, notes: "Picanha" },
      { name: "Pudim", quantity: 2, notes: "" },
    ],
    status: "preparing" as const,
    createdAt: new Date(Date.now() - 20 * 60000),
    priority: "high" as const,
  },
]

export const mockDeliveryOrders = [
  {
    id: "DEL001",
    customer: {
      name: "Carlos Oliveira",
      phone: "(11) 99123-4567",
      address: "Rua das Palmeiras, 123 - Jardim América",
    },
    items: [
      { name: "Marmita G", quantity: 2, price: 65.8 },
      { name: "Pudim", quantity: 2, price: 25.8 },
    ],
    total: 91.6,
    deliveryFee: 8.0,
    status: "preparing" as const,
    paymentMethod: "PIX",
    createdAt: new Date(Date.now() - 20 * 60000),
    estimatedDelivery: new Date(Date.now() + 25 * 60000),
    driver: null,
  },
  {
    id: "DEL002",
    customer: {
      name: "Ana Paula Silva",
      phone: "(11) 98765-4321",
      address: "Av. Brasil, 500 - Centro",
    },
    items: [
      { name: "Feijoada Completa", quantity: 1, price: 49.9 },
      { name: "Refrigerante Lata", quantity: 2, price: 13.8 },
    ],
    total: 63.7,
    deliveryFee: 5.0,
    status: "delivering" as const,
    paymentMethod: "Cartão",
    createdAt: new Date(Date.now() - 45 * 60000),
    estimatedDelivery: new Date(Date.now() + 10 * 60000),
    driver: { name: "Roberto", phone: "(11) 91234-5678" },
  },
  {
    id: "DEL003",
    customer: {
      name: "Fernando Costa",
      phone: "(11) 97654-3210",
      address: "Rua dos Lírios, 89 - Vila Nova",
    },
    items: [
      { name: "Picanha na Chapa", quantity: 2, price: 159.8 },
      { name: "Suco Natural", quantity: 2, price: 19.8 },
    ],
    total: 179.6,
    deliveryFee: 10.0,
    status: "pending" as const,
    paymentMethod: "Dinheiro",
    createdAt: new Date(Date.now() - 5 * 60000),
    estimatedDelivery: new Date(Date.now() + 50 * 60000),
    driver: null,
  },
]

export const mockDrivers = [
  { id: "1", name: "Roberto Silva", phone: "(11) 91234-5678", status: "delivering" as const, currentOrder: "DEL002" },
  { id: "2", name: "Marcos Souza", phone: "(11) 92345-6789", status: "available" as const, currentOrder: null },
  { id: "3", name: "João Pedro", phone: "(11) 93456-7890", status: "available" as const, currentOrder: null },
]

export const mockInventory = [
  { id: "1", name: "Arroz", unit: "kg", quantity: 50, minQuantity: 20, price: 5.5, supplier: "Distribuidora ABC" },
  { id: "2", name: "Feijão Preto", unit: "kg", quantity: 30, minQuantity: 15, price: 8.9, supplier: "Distribuidora ABC" },
  { id: "3", name: "Carne Bovina", unit: "kg", quantity: 25, minQuantity: 10, price: 45.0, supplier: "Frigorífico XYZ" },
  { id: "4", name: "Frango", unit: "kg", quantity: 40, minQuantity: 15, price: 18.5, supplier: "Frigorífico XYZ" },
  { id: "5", name: "Picanha", unit: "kg", quantity: 8, minQuantity: 8, price: 89.9, supplier: "Frigorífico Premium" },
  { id: "6", name: "Óleo de Soja", unit: "L", quantity: 20, minQuantity: 10, price: 7.5, supplier: "Distribuidora ABC" },
  { id: "7", name: "Refrigerante Lata", unit: "un", quantity: 200, minQuantity: 100, price: 3.5, supplier: "Bebidas SA" },
  { id: "8", name: "Embalagem Marmita P", unit: "un", quantity: 150, minQuantity: 200, price: 0.8, supplier: "Embalagens Flex" },
  { id: "9", name: "Embalagem Marmita M", unit: "un", quantity: 400, minQuantity: 200, price: 1.0, supplier: "Embalagens Flex" },
  { id: "10", name: "Embalagem Marmita G", unit: "un", quantity: 300, minQuantity: 150, price: 1.2, supplier: "Embalagens Flex" },
]

export const mockFinancial = {
  accountsPayable: [
    { id: "1", description: "Fornecedor - Frigorífico XYZ", value: 4500.0, dueDate: new Date(Date.now() + 5 * 86400000), status: "pending" as const },
    { id: "2", description: "Aluguel", value: 8000.0, dueDate: new Date(Date.now() + 10 * 86400000), status: "pending" as const },
    { id: "3", description: "Energia Elétrica", value: 1200.0, dueDate: new Date(Date.now() + 3 * 86400000), status: "overdue" as const },
    { id: "4", description: "Internet", value: 250.0, dueDate: new Date(Date.now() + 15 * 86400000), status: "pending" as const },
  ],
  accountsReceivable: [
    { id: "1", description: "Evento Corporativo", value: 5000.0, dueDate: new Date(Date.now() + 7 * 86400000), status: "pending" as const },
    { id: "2", description: "Convênio Empresa A", value: 3500.0, dueDate: new Date(Date.now() - 2 * 86400000), status: "overdue" as const },
  ],
  cashFlow: [
    { date: "01/01", income: 15000, expenses: 8000 },
    { date: "02/01", income: 18000, expenses: 9500 },
    { date: "03/01", income: 16500, expenses: 8200 },
    { date: "04/01", income: 19200, expenses: 10000 },
    { date: "05/01", income: 21000, expenses: 11500 },
    { date: "06/01", income: 17800, expenses: 9800 },
    { date: "07/01", income: 22500, expenses: 12000 },
  ],
}

export const mockUsers = [
  { id: "1", name: "Admin", email: "admin@restaurante.com", role: "admin" as const, avatar: null },
  { id: "2", name: "Gerente", email: "gerente@restaurante.com", role: "manager" as const, avatar: null },
  { id: "3", name: "Caixa 1", email: "caixa1@restaurante.com", role: "cashier" as const, avatar: null },
  { id: "4", name: "Garçom 1", email: "garcom1@restaurante.com", role: "waiter" as const, avatar: null },
  { id: "5", name: "Cozinheiro", email: "cozinha@restaurante.com", role: "kitchen" as const, avatar: null },
]
