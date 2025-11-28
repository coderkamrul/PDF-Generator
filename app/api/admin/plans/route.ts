import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getPlans, createPlan } from "@/lib/models/plan"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

        const plans = await getPlans()
        return NextResponse.json({ plans })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

        const data = await request.json()
        // Basic validation
        if (!data.name || !data.key || data.monthlyPrice === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const id = await createPlan(data)
        return NextResponse.json({ success: true, id })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
