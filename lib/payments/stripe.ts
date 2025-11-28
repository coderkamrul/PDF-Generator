import Stripe from "stripe"
import { getSettings } from "../models/settings"

export async function getStripeClient() {
    const settings = await getSettings()
    if (!settings.payment.isStripeEnabled || !settings.payment.stripeSecretKey) {
        return null
    }

    return new Stripe(settings.payment.stripeSecretKey, {
        apiVersion: "2024-11-20.acacia" as any, // Cast to any to avoid version mismatch errors if types are newer/older
    })
}

export async function createStripePaymentIntent(amount: number, currency: string = "usd") {
    const stripe = await getStripeClient()
    if (!stripe) {
        throw new Error("Stripe is not configured or enabled")
    }

    return stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
            enabled: true,
        },
    })
}

export async function retrievePaymentIntent(paymentIntentId: string) {
    const stripe = await getStripeClient()
    if (!stripe) {
        throw new Error("Stripe is not configured")
    }
    return stripe.paymentIntents.retrieve(paymentIntentId)
}
