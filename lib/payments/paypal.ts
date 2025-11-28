// @ts-ignore
import paypal from "@paypal/checkout-server-sdk"
import { getSettings } from "../models/settings"

export async function getPaypalClient() {
    const settings = await getSettings()
    if (!settings.payment.isPaypalEnabled || !settings.payment.paypalClientId || !settings.payment.paypalSecret) {
        return null
    }

    const Environment =
        process.env.NODE_ENV === "production"
            ? paypal.core.LiveEnvironment
            : paypal.core.SandboxEnvironment

    return new paypal.core.PayPalHttpClient(
        new Environment(settings.payment.paypalClientId, settings.payment.paypalSecret)
    )
}

export async function createPaypalOrder(amount: number, currency: string = "USD") {
    const client = await getPaypalClient()
    if (!client) {
        throw new Error("PayPal is not configured or enabled")
    }

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: currency,
                    value: amount.toString(),
                },
            },
        ],
    })

    const response = await client.execute(request)
    return response.result
}

export async function capturePaypalOrder(orderId: string) {
    const client = await getPaypalClient()
    if (!client) {
        throw new Error("PayPal is not configured")
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})

    const response = await client.execute(request)
    return response.result
}
