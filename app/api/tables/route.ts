import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Retorna todas as mesas do tenant ativo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "companyId é obrigatório" }, { status: 400 })
    }

    const tables = await prisma.table.findMany({
      where: { companyId },
      orderBy: { number: "asc" },
    })

    return NextResponse.json(tables)
  } catch (error) {
    console.error("❌ Erro ao buscar mesas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST/PUT: Cria ou atualiza uma mesa (incluindo posição X/Y e status)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, number, capacity, status, x, y, area, shape, companyId, reservationName, reservationTime, reservationPhone } = body

    if (!id || !companyId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Converte data de reserva se existir
    const parsedResTime = reservationTime ? new Date(reservationTime) : null

    const updatedTable = await prisma.table.upsert({
      where: { id },
      update: {
        number: Number(number),
        capacity: Number(capacity),
        status,
        x: Math.round(Number(x)),
        y: Math.round(Number(y)),
        reservationName,
        reservationTime: parsedResTime,
      },
      create: {
        id,
        companyId,
        number: Number(number),
        capacity: Number(capacity),
        status: status || "free",
        x: Math.round(Number(x)) || 50,
        y: Math.round(Number(y)) || 50,
        reservationName,
        reservationTime: parsedResTime,
      },
    })

    return NextResponse.json(updatedTable)
  } catch (error) {
    console.error("❌ Erro ao salvar mesa:", error)
    return NextResponse.json({ error: "Erro ao salvar dados da mesa no banco de dados." }, { status: 500 })
  }
}

// DELETE: Exclui uma mesa pelo ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
    }

    await prisma.table.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Erro ao deletar mesa:", error)
    return NextResponse.json({ error: "Erro ao deletar mesa." }, { status: 500 })
  }
}
