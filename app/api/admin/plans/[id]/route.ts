import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { updatePlan, deletePlan } from "@/lib/models/plan"

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

        const { id } = await params
        const data = await request.json()
        const success = await updatePlan(id, data)

        return NextResponse.json({ success })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

        const { id } = await params
        const success = await deletePlan(id)
        return NextResponse.json({ success })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
