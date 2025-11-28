import { NextResponse } from "next/server"
import { getSettings } from "@/lib/models/settings"

export async function GET() {
    try {
        const settings = await getSettings()

        // Only return safe public info
        const publicSettings = {
            payment: {
                currency: settings.payment.currency,
                isStripeEnabled: settings.payment.isStripeEnabled,
                stripePublicKey: settings.payment.stripePublicKey,
                isPaypalEnabled: settings.payment.isPaypalEnabled,
                paypalClientId: settings.payment.paypalClientId,
                isCodEnabled: settings.payment.isCodEnabled,
            },
            site: {
                siteName: settings.site.siteName,
                siteDescription: settings.site.siteDescription,
                contactEmail: settings.site.contactEmail,
            },
        }

        return NextResponse.json(publicSettings)
    } catch (error) {
        console.error("Failed to fetch public settings:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
