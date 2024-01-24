const [{ api }, { security }] = await Promise.all([
    import("./api/index.js"),
    import("./security/index.js")
]);

export const req = {
    api,
    security
} as const;
