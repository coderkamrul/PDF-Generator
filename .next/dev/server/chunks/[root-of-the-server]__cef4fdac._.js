module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/jwt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSessionCookie",
    ()=>clearSessionCookie,
    "getSession",
    ()=>getSession,
    "setSessionCookie",
    ()=>setSessionCookie,
    "signToken",
    ()=>signToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || "pdfforge-secret-key-change-in-production";
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: "7d"
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch  {
        return null;
    }
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}
async function setSessionCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    });
}
async function clearSessionCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("auth_token");
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getDb",
    ()=>getDb
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to environment variables");
}
const uri = process.env.MONGODB_URI;
const options = {};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    if (!global._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else //TURBOPACK unreachable
;
async function getDb() {
    const client = await clientPromise;
    return client.db("pdfconverter");
}
const __TURBOPACK__default__export__ = clientPromise;
}),
"[project]/lib/models/settings.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSettings",
    ()=>getSettings,
    "updateSettings",
    ()=>updateSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
const DEFAULT_SETTINGS = {
    payment: {
        stripePublicKey: "",
        stripeSecretKey: "",
        paypalClientId: "",
        paypalSecret: "",
        currency: "USD",
        isStripeEnabled: false,
        isPaypalEnabled: false,
        isCodEnabled: false
    },
    site: {
        siteName: "PDF Generator SaaS",
        siteDescription: "Professional PDF generation tools",
        contactEmail: "admin@example.com",
        maintenanceMode: false
    }
};
async function getSettings() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const settings = db.collection("settings");
    const doc = await settings.findOne({});
    if (!doc) {
        // Initialize default settings if none exist
        const result = await settings.insertOne({
            ...DEFAULT_SETTINGS,
            updatedAt: new Date()
        });
        return {
            ...DEFAULT_SETTINGS,
            _id: result.insertedId,
            updatedAt: new Date()
        };
    }
    return doc;
}
async function updateSettings(newSettings) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const settings = db.collection("settings");
    // Ensure we don't overwrite with partial data structure, merge deeply if needed
    // For simplicity, we'll assume the UI sends structured sections
    const updateDoc = {
        updatedAt: new Date()
    };
    if (newSettings.payment) updateDoc["payment"] = newSettings.payment;
    if (newSettings.site) updateDoc["site"] = newSettings.site;
    const result = await settings.updateOne({}, {
        $set: updateDoc
    }, {
        upsert: true
    });
    return result.acknowledged;
}
}),
"[project]/lib/payments/stripe.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStripePaymentIntent",
    ()=>createStripePaymentIntent,
    "getStripeClient",
    ()=>getStripeClient,
    "retrievePaymentIntent",
    ()=>retrievePaymentIntent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stripe/esm/stripe.esm.node.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/settings.ts [app-route] (ecmascript)");
;
;
async function getStripeClient() {
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSettings"])();
    if (!settings.payment.isStripeEnabled || !settings.payment.stripeSecretKey) {
        return null;
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](settings.payment.stripeSecretKey, {
        apiVersion: "2024-11-20.acacia"
    });
}
async function createStripePaymentIntent(amount, currency = "usd") {
    const stripe = await getStripeClient();
    if (!stripe) {
        throw new Error("Stripe is not configured or enabled");
    }
    return stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
            enabled: true
        }
    });
}
async function retrievePaymentIntent(paymentIntentId) {
    const stripe = await getStripeClient();
    if (!stripe) {
        throw new Error("Stripe is not configured");
    }
    return stripe.paymentIntents.retrieve(paymentIntentId);
}
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[project]/lib/payments/paypal.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// @ts-ignore
__turbopack_context__.s([
    "capturePaypalOrder",
    ()=>capturePaypalOrder,
    "createPaypalOrder",
    ()=>createPaypalOrder,
    "getPaypalClient",
    ()=>getPaypalClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$checkout$2d$server$2d$sdk$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@paypal/checkout-server-sdk/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/settings.ts [app-route] (ecmascript)");
;
;
async function getPaypalClient() {
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSettings"])();
    if (!settings.payment.isPaypalEnabled || !settings.payment.paypalClientId || !settings.payment.paypalSecret) {
        return null;
    }
    const Environment = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$checkout$2d$server$2d$sdk$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].core.SandboxEnvironment;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$checkout$2d$server$2d$sdk$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].core.PayPalHttpClient(new Environment(settings.payment.paypalClientId, settings.payment.paypalSecret));
}
async function createPaypalOrder(amount, currency = "USD") {
    const client = await getPaypalClient();
    if (!client) {
        throw new Error("PayPal is not configured or enabled");
    }
    const request = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$checkout$2d$server$2d$sdk$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: currency,
                    value: amount.toString()
                }
            }
        ]
    });
    const response = await client.execute(request);
    return response.result;
}
async function capturePaypalOrder(orderId) {
    const client = await getPaypalClient();
    if (!client) {
        throw new Error("PayPal is not configured");
    }
    const request = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$checkout$2d$server$2d$sdk$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await client.execute(request);
    return response.result;
}
}),
"[project]/lib/models/transaction.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTransaction",
    ()=>createTransaction,
    "updateTransactionStatus",
    ()=>updateTransactionStatus
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
;
async function createTransaction(userId, amount, currency, provider, creditsAmount) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const transactions = db.collection("transactions");
    const result = await transactions.insertOne({
        userId,
        amount,
        currency,
        provider,
        status: "pending",
        creditsAmount,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result.insertedId.toString();
}
async function updateTransactionStatus(id, status, providerTransactionId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const transactions = db.collection("transactions");
    const update = {
        status,
        updatedAt: new Date()
    };
    if (providerTransactionId) {
        update.providerTransactionId = providerTransactionId;
    }
    const result = await transactions.updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $set: update
    });
    return result.modifiedCount > 0;
}
}),
"[project]/app/api/payments/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/jwt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$stripe$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/payments/stripe.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/payments/paypal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$transaction$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/transaction.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/settings.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
;
;
;
;
;
;
;
async function POST(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    try {
        const { provider, amount, credits } = await request.json();
        const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$settings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSettings"])();
        if (!amount || !credits) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid amount or credits"
            }, {
                status: 400
            });
        }
        // Create a pending transaction record
        const transactionId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$transaction$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTransaction"])(session.userId, amount, settings.payment.currency, provider, credits);
        let result = {};
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
        if (provider === "stripe") {
            const paymentIntent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$stripe$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStripePaymentIntent"])(amount, settings.payment.currency);
            result = {
                clientSecret: paymentIntent.client_secret
            };
            await db.collection("transactions").updateOne({
                _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](transactionId)
            }, {
                $set: {
                    providerTransactionId: paymentIntent.id
                }
            });
        } else if (provider === "paypal") {
            const order = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPaypalOrder"])(amount, settings.payment.currency);
            result = {
                orderId: order.id
            };
            await db.collection("transactions").updateOne({
                _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](transactionId)
            }, {
                $set: {
                    providerTransactionId: order.id
                }
            });
        } else if (provider === "cod") {
            // For COD, we just return success, but admin needs to approve
            result = {
                message: "Order placed. Please contact admin for payment."
            };
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid provider"
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            transactionId,
            ...result
        });
    } catch (error) {
        console.error("Payment creation error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Payment failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cef4fdac._.js.map