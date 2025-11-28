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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || "pdfforge-secret-key-change-in-production";
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: "7d"
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jsonwebtoken$40$9$2e$0$2e$2$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch  {
        return null;
    }
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}
async function setSessionCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    });
}
async function clearSessionCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("auth_token");
}
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
"[project]/lib/models/api-key.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createApiKey",
    ()=>createApiKey,
    "deleteApiKey",
    ()=>deleteApiKey,
    "getAllApiKeys",
    ()=>getAllApiKeys,
    "getApiKeysByUserId",
    ()=>getApiKeysByUserId,
    "verifyApiKey",
    ()=>verifyApiKey
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
function generateApiKey() {
    return "pf_" + __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(24).toString("hex");
}
function hashKey(key) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(key).digest("hex");
}
async function createApiKey(userId, name) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const apiKeys = db.collection("apiKeys");
    const key = generateApiKey();
    const keyHash = hashKey(key);
    const result = await apiKeys.insertOne({
        userId,
        name,
        key: key,
        keyHash,
        createdAt: new Date(),
        lastUsed: null,
        usageCount: 0
    });
    // Return full key only on creation
    return {
        id: result.insertedId.toString(),
        userId,
        name,
        key,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        usageCount: 0
    };
}
async function getApiKeysByUserId(userId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const apiKeys = db.collection("apiKeys");
    const keys = await apiKeys.find({
        userId
    }).toArray();
    return keys.map((k)=>({
            id: k._id.toString(),
            userId: k.userId,
            name: k.name,
            key: k.key,
            createdAt: k.createdAt.toISOString(),
            lastUsed: k.lastUsed?.toISOString() || null,
            usageCount: k.usageCount
        }));
}
async function verifyApiKey(key) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const apiKeys = db.collection("apiKeys");
    const keyHash = hashKey(key);
    const apiKey = await apiKeys.findOne({
        keyHash
    });
    if (!apiKey) return null;
    // Update last used
    await apiKeys.updateOne({
        _id: apiKey._id
    }, {
        $set: {
            lastUsed: new Date()
        },
        $inc: {
            usageCount: 1
        }
    });
    return {
        userId: apiKey.userId,
        keyId: apiKey._id.toString()
    };
}
async function deleteApiKey(id) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const apiKeys = db.collection("apiKeys");
    const result = await apiKeys.deleteOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    });
    return result.deletedCount > 0;
}
async function getAllApiKeys() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const apiKeys = db.collection("apiKeys");
    const keys = await apiKeys.find({}).toArray();
    return keys.map((k)=>({
            id: k._id.toString(),
            userId: k.userId,
            name: k.name,
            key: k.key,
            createdAt: k.createdAt.toISOString(),
            lastUsed: k.lastUsed?.toISOString() || null,
            usageCount: k.usageCount
        }));
}
}),
"[project]/lib/models/user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addCreditsToUser",
    ()=>addCreditsToUser,
    "createUser",
    ()=>createUser,
    "getAllUsers",
    ()=>getAllUsers,
    "getUserById",
    ()=>getUserById,
    "toggleUserDisabled",
    ()=>toggleUserDisabled,
    "updateUserCredits",
    ()=>updateUserCredits,
    "updateUserPlan",
    ()=>updateUserPlan,
    "verifyUser",
    ()=>verifyUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function createUser(email, password, name) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const existingUser = await users.findOne({
        email
    });
    if (existingUser) {
        return null;
    }
    const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
    const isAdmin = email === "admin@pdfforge.com";
    const result = await users.insertOne({
        email,
        password: hashedPassword,
        name,
        plan: "free",
        credits: 10,
        isAdmin,
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return {
        id: result.insertedId.toString(),
        email,
        name,
        plan: "free",
        credits: 10,
        isAdmin,
        createdAt: new Date().toISOString()
    };
}
async function verifyUser(email, password) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const user = await users.findOne({
        email
    });
    if (!user) return null;
    if (user.isDisabled) return null;
    const isValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
    if (!isValid) return null;
    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        plan: user.plan,
        credits: user.credits,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString()
    };
}
async function getUserById(id) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    try {
        const user = await users.findOne({
            _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
        });
        if (!user) return null;
        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            plan: user.plan,
            credits: user.credits,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt.toISOString()
        };
    } catch  {
        return null;
    }
}
async function updateUserCredits(id, credits) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const result = await users.updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $set: {
            credits,
            updatedAt: new Date()
        }
    });
    return result.modifiedCount > 0;
}
async function updateUserPlan(id, plan) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const planCredits = {
        free: 10,
        pro: 100,
        business: 1000
    };
    const result = await users.updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $set: {
            plan,
            credits: planCredits[plan],
            updatedAt: new Date()
        }
    });
    return result.modifiedCount > 0;
}
async function getAllUsers() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const allUsers = await users.find({}).toArray();
    return allUsers.map((user)=>({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            plan: user.plan,
            credits: user.credits,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt.toISOString()
        }));
}
async function toggleUserDisabled(id, isDisabled) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const result = await users.updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $set: {
            isDisabled,
            updatedAt: new Date()
        }
    });
    return result.modifiedCount > 0;
}
async function addCreditsToUser(id, amount) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const users = db.collection("users");
    const result = await users.updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
    }, {
        $inc: {
            credits: amount
        },
        $set: {
            updatedAt: new Date()
        }
    });
    return result.modifiedCount > 0;
}
}),
"[project]/lib/models/usage-log.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUsageLog",
    ()=>createUsageLog,
    "getUsageLogs",
    ()=>getUsageLogs,
    "getUserUsageLogs",
    ()=>getUserUsageLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
async function createUsageLog(userId, action, details, ipAddress, apiKeyId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const logs = db.collection("usageLogs");
    const result = await logs.insertOne({
        userId,
        action,
        details,
        ipAddress,
        apiKeyId,
        createdAt: new Date()
    });
    return {
        id: result.insertedId.toString(),
        userId,
        action,
        details,
        ipAddress,
        apiKeyId,
        createdAt: new Date().toISOString()
    };
}
async function getUsageLogs(limit = 100) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const logs = db.collection("usageLogs");
    const allLogs = await logs.find({}).sort({
        createdAt: -1
    }).limit(limit).toArray();
    return allLogs.map((log)=>({
            id: log._id.toString(),
            userId: log.userId,
            action: log.action,
            details: log.details,
            ipAddress: log.ipAddress,
            apiKeyId: log.apiKeyId,
            createdAt: log.createdAt.toISOString()
        }));
}
async function getUserUsageLogs(userId, limit = 50) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const logs = db.collection("usageLogs");
    const userLogs = await logs.find({
        userId
    }).sort({
        createdAt: -1
    }).limit(limit).toArray();
    return userLogs.map((log)=>({
            id: log._id.toString(),
            userId: log.userId,
            action: log.action,
            details: log.details,
            ipAddress: log.ipAddress,
            apiKeyId: log.apiKeyId,
            createdAt: log.createdAt.toISOString()
        }));
}
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

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
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[project]/lib/cloudinary.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteFromCloudinary",
    ()=>deleteFromCloudinary,
    "getOptimizedImageUrl",
    ()=>getOptimizedImageUrl,
    "uploadImageToCloudinary",
    ()=>uploadImageToCloudinary,
    "uploadPdfToCloudinary",
    ()=>uploadPdfToCloudinary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/cloudinary@2.8.0/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: ("TURBOPACK compile-time value", "ecommerce-tech"),
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
async function uploadPdfToCloudinary(pdfBuffer, filename, userId) {
    const base64Pdf = pdfBuffer.toString("base64");
    const dataUri = `data:application/pdf;base64,${base64Pdf}`;
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload(dataUri, {
        folder: `pdfforge/${userId}/pdfs`,
        public_id: `${Date.now()}-${filename.replace(/\.pdf$/i, "")}`,
        resource_type: "raw",
        format: "pdf"
    });
    return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes
    };
}
async function uploadImageToCloudinary(base64Image, userId, index) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload(base64Image, {
        folder: `pdfforge/${userId}/images`,
        public_id: `img-${Date.now()}-${index}`,
        resource_type: "image"
    });
    return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height
    };
}
async function deleteFromCloudinary(publicId, resourceType = "raw") {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return true;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return false;
    }
}
function getOptimizedImageUrl(publicId, width, height) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].url(publicId, {
        width,
        height,
        crop: "fit",
        quality: "auto",
        fetch_format: "auto"
    });
}
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$cloudinary$40$2$2e$8$2e$0$2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"];
}),
"[project]/lib/models/file.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFile",
    ()=>createFile,
    "deleteFile",
    ()=>deleteFile,
    "getAllFiles",
    ()=>getAllFiles,
    "getFileById",
    ()=>getFileById,
    "getFileStats",
    ()=>getFileStats,
    "getFilesByUserId",
    ()=>getFilesByUserId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cloudinary.ts [app-route] (ecmascript)");
;
;
;
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
async function createFile(userId, filename, size, pages, cloudinaryUrl, cloudinaryPublicId, apiGenerated = false) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const files = db.collection("files");
    const result = await files.insertOne({
        userId,
        filename,
        size,
        pages,
        apiGenerated,
        cloudinaryUrl,
        cloudinaryPublicId,
        createdAt: new Date()
    });
    return {
        id: result.insertedId.toString(),
        userId,
        filename,
        size: formatFileSize(size),
        pages,
        apiGenerated,
        downloadUrl: cloudinaryUrl,
        cloudinaryPublicId,
        createdAt: new Date().toISOString()
    };
}
async function getFilesByUserId(userId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const files = db.collection("files");
    const userFiles = await files.find({
        userId
    }).sort({
        createdAt: -1
    }).toArray();
    return userFiles.map((file)=>({
            id: file._id.toString(),
            userId: file.userId,
            filename: file.filename,
            size: formatFileSize(file.size),
            pages: file.pages,
            apiGenerated: file.apiGenerated,
            downloadUrl: file.cloudinaryUrl,
            cloudinaryPublicId: file.cloudinaryPublicId,
            createdAt: file.createdAt.toISOString()
        }));
}
async function getFileById(id) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const files = db.collection("files");
    try {
        const file = await files.findOne({
            _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
        });
        if (!file) return null;
        return {
            id: file._id.toString(),
            userId: file.userId,
            filename: file.filename,
            size: formatFileSize(file.size),
            pages: file.pages,
            apiGenerated: file.apiGenerated,
            downloadUrl: file.cloudinaryUrl,
            cloudinaryPublicId: file.cloudinaryPublicId,
            createdAt: file.createdAt.toISOString()
        };
    } catch  {
        return null;
    }
}
async function deleteFile(id) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const files = db.collection("files");
    try {
        const file = await files.findOne({
            _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
        });
        if (file?.cloudinaryPublicId) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteFromCloudinary"])(file.cloudinaryPublicId, "raw");
        }
        const result = await files.deleteOne({
            _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](id)
        });
        return result.deletedCount > 0;
    } catch  {
        return false;
    }
}
async function getAllFiles() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const files = db.collection("files");
    const allFiles = await files.find({}).sort({
        createdAt: -1
    }).toArray();
    return allFiles.map((file)=>({
            id: file._id.toString(),
            userId: file.userId,
            filename: file.filename,
            size: formatFileSize(file.size),
            pages: file.pages,
            apiGenerated: file.apiGenerated,
            downloadUrl: file.cloudinaryUrl,
            cloudinaryPublicId: file.cloudinaryPublicId,
            createdAt: file.createdAt.toISOString()
        }));
}
async function getFileStats() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const files = db.collection("files");
    const allFiles = await files.find({}).toArray();
    const apiGenerated = allFiles.filter((f)=>f.apiGenerated).length;
    const totalSize = allFiles.reduce((acc, f)=>acc + f.size, 0);
    return {
        total: allFiles.length,
        apiGenerated,
        totalSize
    };
}
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[externals]/sharp [external] (sharp, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("sharp", () => require("sharp"));

module.exports = mod;
}),
"[project]/app/api/convert/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import { type NextRequest, NextResponse } from "next/server"
// import { getSession } from "@/lib/jwt"
// import { verifyApiKey } from "@/lib/models/api-key"
// import { getUserById, updateUserCredits } from "@/lib/models/user"
// import { createUsageLog } from "@/lib/models/usage-log"
// import { createFile } from "@/lib/models/file"
// import { uploadPdfToCloudinary } from "@/lib/cloudinary"
// import { jsPDF } from "jspdf"
// import sharp from "sharp"
// import { Buffer } from "buffer"
// export async function POST(request: NextRequest) {
//   try {
//     const ip = request.headers.get("x-forwarded-for") || "unknown"
//     let userId: string
//     let apiKeyId: string | undefined
//     let isApiRequest = false
//     const authHeader = request.headers.get("authorization")
//     if (authHeader?.startsWith("Bearer ")) {
//       const apiKey = authHeader.slice(7)
//       const keyData = await verifyApiKey(apiKey)
//       if (!keyData)
//         return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
//       userId = keyData.userId
//       apiKeyId = keyData.keyId
//       isApiRequest = true
//     } else {
//       const session = await getSession()
//       if (!session)
//         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       userId = session.userId
//     }
//     const user = await getUserById(userId)
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
//     if (user.credits <= 0)
//       return NextResponse.json({ error: "Insufficient credits" }, { status: 403 })
//     const body = await request.json()
//     const images: string[] = body.images || []
//     const options = body.options
//     if (!images.length)
//       return NextResponse.json({ error: "No images provided" }, { status: 400 })
//     // PAGE SIZES
//     const pageSizes: Record<string, { width: number; height: number }> = {
//       a4: { width: 210, height: 297 },
//       letter: { width: 215.9, height: 279.4 },
//       legal: { width: 215.9, height: 355.6 },
//       square: { width: 200, height: 200 },
//       twoThree: { width: 200, height: 300 },
//     }
//     const basePage = pageSizes[options.pageSize] || pageSizes["a4"]
//     const isLandscape = options.orientation === "landscape"
//     const pdfWidth = isLandscape ? basePage.height : basePage.width
//     const pdfHeight = isLandscape ? basePage.width : basePage.height
//     const pdf = new jsPDF({
//       orientation: options.orientation,
//       unit: "mm",
//       format: [pdfWidth, pdfHeight],
//     })
//     for (let i = 0; i < images.length; i++) {
//       if (i > 0)
//         pdf.addPage([pdfWidth, pdfHeight], options.orientation)
//       const base64 = images[i]
//       const imgBuffer = Buffer.from(base64.split(",")[1], "base64")
//       // Extract size using SHARP
//       const meta = await sharp(imgBuffer).metadata()
//       const imgWidth = meta.width || 1000
//       const imgHeight = meta.height || 1000
//       const imgRatio = imgWidth / imgHeight
//       const pageRatio = pdfWidth / pdfHeight
//       let finalW = pdfWidth
//       let finalH = pdfHeight
//       let x = 0
//       let y = 0
//       if (options.fitMode === "fit") {
//         if (imgRatio > pageRatio) {
//           finalW = pdfWidth
//           finalH = pdfWidth / imgRatio
//         } else {
//           finalH = pdfHeight
//           finalW = pdfHeight * imgRatio
//         }
//         x = (pdfWidth - finalW) / 2
//         y = (pdfHeight - finalH) / 2
//       }
//       pdf.addImage(base64, "JPEG", x, y, finalW, finalH)
//     }
//     // Make final PDF
//     const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))
//     const cloudinaryResult = await uploadPdfToCloudinary(
//       pdfBuffer,
//       options.filename,
//       userId
//     )
//     await updateUserCredits(userId, user.credits - 1)
//     await createUsageLog(
//       userId,
//       "CONVERT",
//       `Converted ${images.length} images`,
//       ip,
//       apiKeyId
//     )
//     await createFile(
//       userId,
//       options.filename,
//       pdfBuffer.length,
//       images.length,
//       cloudinaryResult.secure_url,
//       cloudinaryResult.public_id,
//       isApiRequest
//     )
//     return NextResponse.json({
//       success: true,
//       downloadUrl: cloudinaryResult.secure_url,
//       filename: options.filename,
//     })
//   } catch (error: any) {
//     console.error("Convert Error:", error)
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/jwt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$api$2d$key$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/api-key.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/user.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$usage$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/usage-log.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$file$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/file.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cloudinary.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jspdf$40$3$2e$0$2e$4$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jspdf@3.0.4/node_modules/jspdf/dist/jspdf.node.min.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/sharp [external] (sharp, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
;
;
;
;
;
;
;
;
;
;
// NEW → URL to base64 helper
async function fetchImageAsBase64(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
    const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") || "image/jpeg";
    return `data:${mime};base64,${buffer.toString("base64")}`;
}
async function POST(request) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        let userId;
        let apiKeyId;
        let isApiRequest = false;
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const apiKey = authHeader.slice(7);
            const keyData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$api$2d$key$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyApiKey"])(apiKey);
            if (!keyData) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid API key"
            }, {
                status: 401
            });
            userId = keyData.userId;
            apiKeyId = keyData.keyId;
            isApiRequest = true;
        } else {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
            if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Authentication required"
            }, {
                status: 401
            });
            userId = session.userId;
        }
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserById"])(userId);
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "User not found"
        }, {
            status: 404
        });
        if (user.credits <= 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Insufficient credits"
        }, {
            status: 403
        });
        const body = await request.json();
        // images can be mix of base64 + URLs
        const rawImages = body.images || [];
        const options = body.options;
        if (!rawImages.length) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "No images provided"
        }, {
            status: 400
        });
        // FINAL → all images as base64
        let images = [];
        for (const item of rawImages){
            if (item.startsWith("http://") || item.startsWith("https://")) {
                const base64 = await fetchImageAsBase64(item);
                images.push(base64);
            } else {
                images.push(item); // already base64
            }
        }
        // PAGE SIZES
        const pageSizes = {
            a4: {
                width: 210,
                height: 297
            },
            letter: {
                width: 215.9,
                height: 279.4
            },
            legal: {
                width: 215.9,
                height: 355.6
            },
            square: {
                width: 200,
                height: 200
            },
            twoThree: {
                width: 200,
                height: 300
            }
        };
        const basePage = pageSizes[options.pageSize] || pageSizes["a4"];
        const isLandscape = options.orientation === "landscape";
        const pdfWidth = isLandscape ? basePage.height : basePage.width;
        const pdfHeight = isLandscape ? basePage.width : basePage.height;
        const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jspdf$40$3$2e$0$2e$4$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsPDF"]({
            orientation: options.orientation,
            unit: "mm",
            format: [
                pdfWidth,
                pdfHeight
            ]
        });
        for(let i = 0; i < images.length; i++){
            if (i > 0) pdf.addPage([
                pdfWidth,
                pdfHeight
            ], options.orientation);
            const base64 = images[i];
            const imgBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(base64.split(",")[1], "base64");
            // Extract size using SHARP
            const meta = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$29$__["default"])(imgBuffer).metadata();
            const imgWidth = meta.width || 1000;
            const imgHeight = meta.height || 1000;
            const imgRatio = imgWidth / imgHeight;
            const pageRatio = pdfWidth / pdfHeight;
            let finalW = pdfWidth;
            let finalH = pdfHeight;
            let x = 0;
            let y = 0;
            if (options.fitMode === "fit") {
                if (imgRatio > pageRatio) {
                    finalW = pdfWidth;
                    finalH = pdfWidth / imgRatio;
                } else {
                    finalH = pdfHeight;
                    finalW = pdfHeight * imgRatio;
                }
                x = (pdfWidth - finalW) / 2;
                y = (pdfHeight - finalH) / 2;
            }
            pdf.addImage(base64, "JPEG", x, y, finalW, finalH);
        }
        // Make final PDF
        const pdfBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(pdf.output("arraybuffer"));
        const cloudinaryResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadPdfToCloudinary"])(pdfBuffer, options.filename, userId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateUserCredits"])(userId, user.credits - 1);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$usage$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createUsageLog"])(userId, "CONVERT", `Converted ${images.length} images`, ip, apiKeyId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$file$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFile"])(userId, options.filename, pdfBuffer.length, images.length, cloudinaryResult.secure_url, cloudinaryResult.public_id, isApiRequest);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            downloadUrl: cloudinaryResult.secure_url,
            filename: options.filename
        });
    } catch (error) {
        console.error("Convert Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__42240c3a._.js.map