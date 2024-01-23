const [db, { req }] = await Promise.all([
    import("./db.js"),
    import("./req/index.js"),
]);

export const schema = {
    db,
    req,
} as const;
