import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { retrievePaymentIntent } from "@/lib/payments/stripe"
import { capturePaypalOrder } from "@/lib/payments/paypal"
import { updateTransactionStatus } from "@/lib/models/transaction"
import { addCreditsToUser } from "@/lib/models/user"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { transactionId, providerTransactionId } = await request.json()

        if (!transactionId && !providerTransactionId) {
            return NextResponse.json({ error: "Transaction ID or Provider Transaction ID required" }, { status: 400 })
        }

        const db = await getDb()
        let transaction

        if (transactionId && transactionId !== "LOOKUP_BY_PROVIDER_ID") {
            transaction = await db.collection("transactions").findOne({ _id: new ObjectId(transactionId) })
        } else if (providerTransactionId) {
            transaction = await db.collection("transactions").findOne({ providerTransactionId })
        }

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
        }

        if (transaction.status === "completed") {
            return NextResponse.json({ success: true, message: "Already completed" })
        }

        let isVerified = false

        if (transaction.provider === "stripe") {
            if (!providerTransactionId) {
                return NextResponse.json({ error: "Provider Transaction ID required" }, { status: 400 })
            }
            const paymentIntent = await retrievePaymentIntent(providerTransactionId)
            if (paymentIntent.status === "succeeded") {
                isVerified = true
            }
        } else if (transaction.provider === "paypal") {
            if (!providerTransactionId) {
                return NextResponse.json({ error: "Provider Transaction ID required" }, { status: 400 })
            }
            try {
                const capture = await capturePaypalOrder(providerTransactionId)
                if (capture.status === "COMPLETED") {
                    isVerified = true
                }
            } catch (e) {
                console.error("PayPal capture error", e)
            }
        } else if (transaction.provider === "cod") {
            return NextResponse.json({ error: "COD transactions must be verified by admin" }, { status: 400 })
        }

        if (isVerified) {
            await updateTransactionStatus(transaction._id.toString(), "completed", providerTransactionId)
            await addCreditsToUser(transaction.userId, transaction.creditsAmount)
            return NextResponse.json({ success: true })
        } else {
            await updateTransactionStatus(transaction._id.toString(), "failed", providerTransactionId)
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
        }
    } catch (error: any) {
        console.error("Verification error:", error)
        return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 })
    }
}
