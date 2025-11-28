import { ObjectId } from "mongodb"
import { getDb } from "../mongodb"

export interface PaymentSettings {
    stripePublicKey: string
    stripeSecretKey: string
    paypalClientId: string
    paypalSecret: string
    currency: string
    isStripeEnabled: boolean
    isPaypalEnabled: boolean
    isCodEnabled: boolean
}

export interface SiteSettings {
    siteName: string
    siteDescription: string
    contactEmail: string
    maintenanceMode: boolean
}

export interface SettingsDocument {
    _id?: ObjectId
    payment: PaymentSettings
    site: SiteSettings
    updatedAt: Date
}

const DEFAULT_SETTINGS: Omit<SettingsDocument, "_id" | "updatedAt"> = {
    payment: {
        stripePublicKey: "",
        stripeSecretKey: "",
        paypalClientId: "",
        paypalSecret: "",
        currency: "USD",
        isStripeEnabled: false,
        isPaypalEnabled: false,
        isCodEnabled: false,
    },
    site: {
        siteName: "PDF Generator SaaS",
        siteDescription: "Professional PDF generation tools",
        contactEmail: "admin@example.com",
        maintenanceMode: false,
    },
}

export async function getSettings(): Promise<SettingsDocument> {
    const db = await getDb()
    const settings = db.collection<SettingsDocument>("settings")

    const doc = await settings.findOne({})
    if (!doc) {
        // Initialize default settings if none exist
        const result = await settings.insertOne({
            ...DEFAULT_SETTINGS,
            updatedAt: new Date(),
        })
        return { ...DEFAULT_SETTINGS, _id: result.insertedId, updatedAt: new Date() }
    }

    return doc
}

export async function updateSettings(
    newSettings: Partial<SettingsDocument>
): Promise<boolean> {
    const db = await getDb()
    const settings = db.collection<SettingsDocument>("settings")

    // Ensure we don't overwrite with partial data structure, merge deeply if needed
    // For simplicity, we'll assume the UI sends structured sections

    const updateDoc: any = {
        updatedAt: new Date(),
    }

    if (newSettings.payment) updateDoc["payment"] = newSettings.payment
    if (newSettings.site) updateDoc["site"] = newSettings.site

    const result = await settings.updateOne({}, { $set: updateDoc }, { upsert: true })
    return result.acknowledged
}
