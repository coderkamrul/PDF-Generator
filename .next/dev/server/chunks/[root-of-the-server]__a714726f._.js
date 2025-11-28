module.exports = [
"[project]/lib/mongodb.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/lib/mongodb.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/lib/models/user.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/_320a74db._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/models/user.ts [app-route] (ecmascript)");
    });
});
}),
"[externals]/mongodb [external] (mongodb, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[externals]/mongodb [external] (mongodb, cjs)");
    });
});
}),
];