module.exports = [
"[project]/lib/models/api-limits.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_API_LIMITS",
    ()=>DEFAULT_API_LIMITS,
    "DEFAULT_KEY_LIMITS",
    ()=>DEFAULT_KEY_LIMITS,
    "canCreateApiKey",
    ()=>canCreateApiKey,
    "checkApiLimit",
    ()=>checkApiLimit,
    "getApiUsageToday",
    ()=>getApiUsageToday,
    "getUserApiLimit",
    ()=>getUserApiLimit,
    "getUserKeyLimit",
    ()=>getUserKeyLimit,
    "incrementApiUsage",
    ()=>incrementApiUsage,
    "setUserApiLimit",
    ()=>setUserApiLimit,
    "setUserKeyLimit",
    ()=>setUserKeyLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
;
const DEFAULT_API_LIMITS = {
    free: 10,
    pro: 500,
    business: null
};
const DEFAULT_KEY_LIMITS = {
    free: 1,
    pro: 5,
    business: 20
};
async function getUserApiLimit(userId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const user = await db.collection("users").findOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](userId)
    });
    if (!user) return 0;
    // Custom limit overrides plan limit
    if (user.apiLimit !== undefined && user.apiLimit !== null) {
        return user.apiLimit;
    }
    // Return plan-based limit
    const plan = user.plan || "free";
    return DEFAULT_API_LIMITS[plan] || DEFAULT_API_LIMITS.free;
}
async function getUserKeyLimit(userId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const user = await db.collection("users").findOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](userId)
    });
    if (!user) return 1;
    // Custom limit overrides plan limit
    if (user.maxApiKeys !== undefined && user.maxApiKeys !== null) {
        return user.maxApiKeys;
    }
    // Return plan-based limit
    const plan = user.plan || "free";
    return DEFAULT_KEY_LIMITS[plan] || DEFAULT_KEY_LIMITS.free;
}
async function checkApiLimit(userId) {
    const limit = await getUserApiLimit(userId);
    // Unlimited access
    if (limit === null) {
        return {
            allowed: true,
            remaining: -1
        };
    }
    const usage = await getApiUsageToday(userId);
    const remaining = Math.max(0, limit - usage);
    return {
        allowed: usage < limit,
        remaining
    };
}
async function canCreateApiKey(userId) {
    const limit = await getUserKeyLimit(userId);
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const count = await db.collection("api_keys").countDocuments({
        userId
    });
    return count < limit;
}
async function getApiUsageToday(userId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await db.collection("usage-logs").countDocuments({
        userId,
        type: "api",
        createdAt: {
            $gte: today
        }
    });
    return count;
}
async function incrementApiUsage(userId, apiKeyId) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    await db.collection("usage-logs").insertOne({
        userId,
        apiKeyId,
        type: "api",
        createdAt: new Date()
    });
}
async function setUserApiLimit(userId, limit) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const result = await db.collection("users").updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](userId)
    }, {
        $set: {
            apiLimit: limit
        }
    });
    return result.modifiedCount > 0;
}
async function setUserKeyLimit(userId, limit) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const result = await db.collection("users").updateOne({
        _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](userId)
    }, {
        $set: {
            maxApiKeys: limit
        }
    });
    return result.modifiedCount > 0;
}
}),
];

//# sourceMappingURL=lib_models_api-limits_ts_80d345c0._.js.map