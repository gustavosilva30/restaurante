import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando o Seeder do Banco de Dados...")

  // 1. Limpar dados antigos para evitar duplicidade de chaves únicas no seed
  console.log("🧹 Limpando dados antigos...")
  await prisma.financialTransaction.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.deliveryDetail.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.table.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  // 2. Criar Empresas (Tenants)
  console.log("🏢 Cadastrando empresas (tenants)...")
  
  const saborArte = await prisma.company.create({
    data: {
      id: "10000000-0000-0000-0000-000000000001",
      name: "Restaurante Sabor & Arte",
      logo: "/placeholder-logo.png",
      domain: "saborearte",
      plan: "premium",
      address: "Av. Paulista, 1000 - São Paulo, SP",
      phone: "(11) 99999-9999",
    }
  })

  const marmitaria = await prisma.company.create({
    data: {
      id: "20000000-0000-0000-0000-000000000002",
      name: "Marmitaria Caseira",
      logo: "/placeholder-logo.png",
      domain: "marmitariacaseira",
      plan: "basic",
      address: "Rua das Flores, 500 - Rio de Janeiro, RJ",
      phone: "(21) 98888-8888",
    }
  })

  // 3. Criar Usuários para Sabor & Arte
  console.log("👥 Cadastrando usuários...")
  await prisma.user.createMany({
    data: [
      {
        id: "11000000-0000-0000-0000-000000000001",
        companyId: saborArte.id,
        name: "Admin Sabor",
        email: "admin@restaurante.com",
        passwordHash: "$2b$10$vI8a7H1v1/K1K1K1K1K1K.1234567890abcdefghijklmnopqrst", // fake hash para admin
        role: "admin",
      },
      {
        id: "11000000-0000-0000-0000-000000000002",
        companyId: saborArte.id,
        name: "Gerente Sabor",
        email: "gerente@restaurante.com",
        passwordHash: "$2b$10$vI8a7H1v1/K1K1K1K1K1K.1234567890abcdefghijklmnopqrst",
        role: "manager",
      },
      {
        id: "11000000-0000-0000-0000-000000000003",
        companyId: saborArte.id,
        name: "Caixa Sabor",
        email: "caixa1@restaurante.com",
        passwordHash: "$2b$10$vI8a7H1v1/K1K1K1K1K1K.1234567890abcdefghijklmnopqrst",
        role: "cashier",
      },
    ]
  })

  // 4. Criar Categorias do Cardápio
  console.log("🍽️ Cadastrando categorias...")
  const catPratos = await prisma.category.create({
    data: { id: "10000000-0000-0000-0000-000000000010", companyId: saborArte.id, name: "Pratos Principais", icon: "🍽️", color: "#10b981" }
  })
  const catMarmitas = await prisma.category.create({
    data: { id: "20000000-0000-0000-0000-000000000020", companyId: saborArte.id, name: "Marmitas", icon: "📦", color: "#f59e0b" }
  })
  const catSelf = await prisma.category.create({
    data: { id: "30000000-0000-0000-0000-000000000030", companyId: saborArte.id, name: "Self-Service", icon: "🥗", color: "#3b82f6" }
  })
  const catBebidas = await prisma.category.create({
    data: { id: "40000000-0000-0000-0000-000000000040", companyId: saborArte.id, name: "Bebidas", icon: "🥤", color: "#8b5cf6" }
  })
  const catDoces = await prisma.category.create({
    data: { id: "50000000-0000-0000-0000-000000000050", companyId: saborArte.id, name: "Sobremesas", icon: "🍰", color: "#ec4899" }
  })

  // 5. Criar Produtos do Cardápio
  console.log("🥩 Cadastrando produtos...")
  const feijoada = await prisma.product.create({
    data: { id: "11100000-0000-0000-0000-000000000001", companyId: saborArte.id, categoryId: catPratos.id, name: "Feijoada Completa", description: "Feijoada tradicional com acompanhamentos", price: 49.90 }
  })
  const picanha = await prisma.product.create({
    data: { id: "11100000-0000-0000-0000-000000000002", companyId: saborArte.id, categoryId: catPratos.id, name: "Picanha na Chapa", description: "Picanha grelhada com arroz, feijão e fritas", price: 79.90 }
  })
  const marmitaP = await prisma.product.create({
    data: { id: "22200000-0000-0000-0000-000000000001", companyId: saborArte.id, categoryId: catMarmitas.id, name: "Marmita P", description: "Marmita pequena - 1 proteína + 2 acompanhamentos", price: 18.90 }
  })
  const marmitaM = await prisma.product.create({
    data: { id: "22200000-0000-0000-0000-000000000002", companyId: saborArte.id, categoryId: catMarmitas.id, name: "Marmita M", description: "Marmita média - 1 proteína + 3 acompanhamentos", price: 24.90 }
  })
  const marmitaG = await prisma.product.create({
    data: { id: "22200000-0000-0000-0000-000000000003", companyId: saborArte.id, categoryId: catMarmitas.id, name: "Marmita G", description: "Marmita grande - 2 proteínas + 4 acompanhamentos", price: 32.90 }
  })
  const selfKg = await prisma.product.create({
    data: { id: "33300000-0000-0000-0000-000000000001", companyId: saborArte.id, categoryId: catSelf.id, name: "Buffet por Kg", description: "Self-service variado por quilo", price: 54.90 }
  })
  const refrigerante = await prisma.product.create({
    data: { id: "44400000-0000-0000-0000-000000000001", companyId: saborArte.id, categoryId: catBebidas.id, name: "Refrigerante Lata", description: "Coca-Cola, Guaraná, Fanta", price: 6.90 }
  })
  const suco = await prisma.product.create({
    data: { id: "44400000-0000-0000-0000-000000000002", companyId: saborArte.id, categoryId: catBebidas.id, name: "Suco Natural", description: "Laranja, Limão, Abacaxi, Maracujá", price: 9.90 }
  })
  const pudim = await prisma.product.create({
    data: { id: "55500000-0000-0000-0000-000000000001", companyId: saborArte.id, categoryId: catDoces.id, name: "Pudim", description: "Pudim de leite condensado", price: 12.90 }
  })

  // 6. Criar Mesas
  console.log("🪑 Mapeando mesas...")
  await prisma.table.createMany({
    data: [
      { id: "10100000-0000-0000-0000-000000000001", companyId: saborArte.id, number: 1, capacity: 4, status: "free", x: 50, y: 50 },
      { id: "10100000-0000-0000-0000-000000000002", companyId: saborArte.id, number: 2, capacity: 4, status: "occupied", x: 150, y: 50 },
      { id: "10100000-0000-0000-0000-000000000003", companyId: saborArte.id, number: 3, capacity: 6, status: "occupied", x: 250, y: 50 },
      { id: "10100000-0000-0000-0000-000000000004", companyId: saborArte.id, number: 4, capacity: 2, status: "reserved", x: 350, y: 50, reservationName: "João Silva", reservationTime: new Date() },
      { id: "10100000-0000-0000-0000-000000000005", companyId: saborArte.id, number: 5, capacity: 4, status: "free", x: 50, y: 150 },
      { id: "10100000-0000-0000-0000-000000000006", companyId: saborArte.id, number: 6, capacity: 8, status: "occupied", x: 150, y: 150 },
      { id: "10100000-0000-0000-0000-000000000007", companyId: saborArte.id, number: 7, capacity: 4, status: "closing", x: 250, y: 150 },
    ]
  })

  // 7. Criar Entregadores
  console.log("🏍️ Cadastrando entregadores...")
  const roberto = await prisma.driver.create({
    data: { id: "11110000-0000-0000-0000-000000000001", companyId: saborArte.id, name: "Roberto Silva", phone: "(11) 91234-5678", status: "delivering" }
  })
  await prisma.driver.create({
    data: { id: "11110000-0000-0000-0000-000000000002", companyId: saborArte.id, name: "Marcos Souza", phone: "(11) 92345-6789", status: "available" }
  })

  // 8. Criar Pedidos (Exemplos)
  console.log("📝 Cadastrando pedidos ativos...")
  // Pedido Mesa 2
  const orderM2 = await prisma.order.create({
    data: {
      id: "90000000-0000-0000-0000-000000000001",
      orderCode: "ORD-001",
      companyId: saborArte.id,
      tableId: "10100000-0000-0000-0000-000000000002",
      type: "table",
      status: "preparing",
      subtotal: 179.70,
      total: 179.70,
    }
  })
  await prisma.orderItem.createMany({
    data: [
      { orderId: orderM2.id, productId: feijoada.id, quantity: 2, price: 49.90, notes: "Sem couve" },
      { orderId: orderM2.id, productId: picanha.id, quantity: 1, price: 79.90, notes: "Mal passada" }
    ]
  })

  // Pedido Delivery
  const orderDel = await prisma.order.create({
    data: {
      id: "90000000-0000-0000-0000-000000000002",
      orderCode: "DEL-001",
      companyId: saborArte.id,
      type: "delivery",
      status: "preparing",
      subtotal: 91.60,
      deliveryFee: 8.00,
      total: 99.60,
      paymentMethod: "PIX",
    }
  })
  await prisma.orderItem.createMany({
    data: [
      { orderId: orderDel.id, productId: marmitaG.id, quantity: 2, price: 32.90 },
      { orderId: orderDel.id, productId: pudim.id, quantity: 2, price: 12.90 }
    ]
  })
  await prisma.deliveryDetail.create({
    data: {
      orderId: orderDel.id,
      customerName: "Carlos Oliveira",
      customerPhone: "(11) 99123-4567",
      address: "Rua das Palmeiras, 123 - Jardim América",
      driverId: null,
    }
  })

  // 9. Estoque/Insumos
  console.log("📦 Cadastrando insumos de estoque...")
  await prisma.inventory.createMany({
    data: [
      { companyId: saborArte.id, name: "Arroz", unit: "kg", quantity: 50, minQuantity: 20, price: 5.50, supplier: "Distribuidora ABC" },
      { companyId: saborArte.id, name: "Feijão Preto", unit: "kg", quantity: 30, minQuantity: 15, price: 8.90, supplier: "Distribuidora ABC" },
      { companyId: saborArte.id, name: "Carne Bovina", unit: "kg", quantity: 25, minQuantity: 10, price: 45.00, supplier: "Frigorífico XYZ" },
    ]
  })

  // 10. Financeiro
  console.log("💰 Cadastrando transações financeiras...")
  await prisma.financialTransaction.createMany({
    data: [
      { companyId: saborArte.id, description: "Fornecedor - Frigorífico XYZ", type: "payable", value: 4500.00, dueDate: new Date(), status: "pending" },
      { companyId: saborArte.id, description: "Aluguel", type: "payable", value: 8000.00, dueDate: new Date(), status: "pending" },
      { companyId: saborArte.id, description: "Energia Elétrica", type: "payable", value: 1200.00, dueDate: new Date(), status: "overdue" },
    ]
  })

  console.log("🌱 Banco de Dados populado com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar Seeder:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
