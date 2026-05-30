import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ID padrão da empresa simulada (Sabor & Arte) para o Tenant do SaaS
const DEFAULT_COMPANY_ID = "10000000-0000-0000-0000-000000000001"

// GET: Retorna os itens de estoque direto do PostgreSQL da VPS
export async function GET() {
  try {
    const items = await prisma.inventory.findMany({
      where: {
        companyId: DEFAULT_COMPANY_ID,
      },
      orderBy: {
        name: "asc",
      },
    })
    
    // Converte os valores Decimal do Prisma para number puro para o frontend
    const serializedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      quantity: Number(item.quantity),
      minQuantity: Number(item.minQuantity),
      price: Number(item.price),
      supplier: item.supplier || "",
      updatedAt: item.updatedAt.toISOString(),
    }))

    return NextResponse.json(serializedItems)
  } catch (error: any) {
    console.error("❌ Erro na API de Estoque (GET):", error)
    return NextResponse.json({ error: "Erro ao buscar estoque." }, { status: 500 })
  }
}

// POST: Cadastra um novo insumo no estoque
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, unit, quantity, minQuantity, price, supplier } = body

    if (!name || !unit) {
      return NextResponse.json({ error: "Nome e Unidade são obrigatórios." }, { status: 400 })
    }

    const newItem = await prisma.inventory.create({
      data: {
        companyId: DEFAULT_COMPANY_ID,
        name,
        unit,
        quantity: Number(quantity) || 0,
        minQuantity: Number(minQuantity) || 0,
        price: Number(price) || 0,
        supplier: supplier || "",
      },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error: any) {
    console.error("❌ Erro na API de Estoque (POST):", error)
    return NextResponse.json({ error: "Erro ao cadastrar item de estoque." }, { status: 500 })
  }
}
