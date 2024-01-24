const [{ auth }, { user }, { security }] = await Promise.all([
    import("./auth.js"),
    import("./user.js"),
    import("./security/index.js")
]);

export const req = {
    auth,
    user,
    security
} as const;
