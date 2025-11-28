import { NextResponse } from "next/server"
import { getPlans } from "@/lib/models/plan"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const plans = await getPlans()
        return NextResponse.json({ plans })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
