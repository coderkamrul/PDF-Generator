import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { createStripePaymentIntent } from "@/lib/payments/stripe"
import { createPaypalOrder } from "@/lib/payments/paypal"
import { createTransaction } from "@/lib/models/transaction"
import { getSettings } from "@/lib/models/settings"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { provider, amount, credits } = await request.json()
        const settings = await getSettings()

        if (!amount || !credits) {
            return NextResponse.json({ error: "Invalid amount or credits" }, { status: 400 })
        }

        // Create a pending transaction record
        const transactionId = await createTransaction(
            session.userId,
            amount,
            settings.payment.currency,
            provider,
            credits
        )

        let result: any = {}
        const db = await getDb()

        if (provider === "stripe") {
            const paymentIntent = await createStripePaymentIntent(amount, settings.payment.currency)
            result = { clientSecret: paymentIntent.client_secret }

            await db.collection("transactions").updateOne(
                { _id: new ObjectId(transactionId) },
                { $set: { providerTransactionId: paymentIntent.id } }
            )
        } else if (provider === "paypal") {
            const order = await createPaypalOrder(amount, settings.payment.currency)
            result = { orderId: order.id }

            await db.collection("transactions").updateOne(
                { _id: new ObjectId(transactionId) },
                { $set: { providerTransactionId: order.id } }
            )
        } else if (provider === "cod") {
            // For COD, we just return success, but admin needs to approve
            result = { message: "Order placed. Please contact admin for payment." }
        } else {
            return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            transactionId,
            ...result,
        })
    } catch (error: any) {
        console.error("Payment creation error:", error)
        return NextResponse.json({ error: error.message || "Payment failed" }, { status: 500 })
    }
}
